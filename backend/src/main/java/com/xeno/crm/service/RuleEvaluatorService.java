package com.xeno.crm.service;

import com.xeno.crm.entity.Customer;
import com.xeno.crm.repository.CustomerRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class RuleEvaluatorService {

    private final CustomerRepository customerRepository;

    public List<Customer> previewAudience(String ruleLogic) {
        Specification<Customer> spec = parseRuleToSpecification(ruleLogic);
        return customerRepository.findAll(spec);
    }

    public long getAudienceCount(String ruleLogic) {
        Specification<Customer> spec = parseRuleToSpecification(ruleLogic);
        return customerRepository.count(spec);
    }

    public boolean validateRuleSyntax(String ruleLogic) {
        try {
            parseRuleToSpecification(ruleLogic);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getRuleSyntaxErrors(String ruleLogic) {
        try {
            parseRuleToSpecification(ruleLogic);
            return "";
        } catch (Exception e) {
            return e.getMessage();
        }
    }

    private Specification<Customer> parseRuleToSpecification(String ruleLogic) {
        String normalizedRule = ruleLogic.trim().toLowerCase();

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            String[] andParts = normalizedRule.split("\\s+and\\s+");

            for (String andPart : andParts) {
                String[] orParts = andPart.split("\\s+or\\s+");
                List<Predicate> orPredicates = new ArrayList<>();

                for (String condition : orParts) {
                    Predicate predicate = parseCondition(condition.trim(), root, cb);
                    if (predicate != null) {
                        orPredicates.add(predicate);
                    }
                }

                if (!orPredicates.isEmpty()) {
                    if (orPredicates.size() == 1) {
                        predicates.add(orPredicates.get(0));
                    } else {
                        predicates.add(cb.or(orPredicates.toArray(new Predicate[0])));
                    }
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Predicate parseCondition(String condition, jakarta.persistence.criteria.Root<Customer> root, CriteriaBuilder cb) {
        // totalSpend > 10000
        Pattern spendPattern = Pattern.compile("total[_ ]?spend\\s*([><=!]+)\\s*(\\d+)");
        Matcher spendMatcher = spendPattern.matcher(condition);
        if (spendMatcher.find()) {
            return buildNumericPredicate(root.get("totalSpend"), spendMatcher.group(1), Integer.parseInt(spendMatcher.group(2)), cb);
        }

        // visits < 3
        Pattern visitsPattern = Pattern.compile("visits\\s*([><=!]+)\\s*(\\d+)");
        Matcher visitsMatcher = visitsPattern.matcher(condition);
        if (visitsMatcher.find()) {
            return buildNumericPredicate(root.get("visits"), visitsMatcher.group(1), Integer.parseInt(visitsMatcher.group(2)), cb);
        }

        // age > 30
        Pattern agePattern = Pattern.compile("age\\s*([><=!]+)\\s*(\\d+)");
        Matcher ageMatcher = agePattern.matcher(condition);
        if (ageMatcher.find()) {
            return buildNumericPredicate(root.get("age"), ageMatcher.group(1), Integer.parseInt(ageMatcher.group(2)), cb);
        }

        // gender = male
        Pattern genderPattern = Pattern.compile("gender\\s*([=><!]+)\\s*(\\w+)");
        Matcher genderMatcher = genderPattern.matcher(condition);
        if (genderMatcher.find()) {
            return buildStringPredicate(root.get("gender"), genderMatcher.group(1), genderMatcher.group(2), cb);
        }

        // location = delhi
        Pattern locationPattern = Pattern.compile("location\\s*([=><!]+)\\s*(\\w+)");
        Matcher locationMatcher = locationPattern.matcher(condition);
        if (locationMatcher.find()) {
            return buildStringPredicate(root.get("location"), locationMatcher.group(1), locationMatcher.group(2), cb);
        }

        // last_order_date < 90 days ago
        Pattern datePattern = Pattern.compile("last[_ ]?order[_ ]?date\\s*([><=!]+)\\s*(\\d+)\\s*days?\\s*ago");
        Matcher dateMatcher = datePattern.matcher(condition);
        if (dateMatcher.find()) {
            String operator = dateMatcher.group(1);
            int daysAgo = Integer.parseInt(dateMatcher.group(2));
            LocalDate date = LocalDate.now().minusDays(daysAgo);
            return buildDatePredicate(root.get("lastOrderDate"), operator, date, cb);
        }

        throw new IllegalArgumentException("Unsupported condition: " + condition);
    }

    private Predicate buildNumericPredicate(Path<Integer> path, String operator, int value, CriteriaBuilder cb) {
        return switch (operator) {
            case ">" -> cb.greaterThan(path, value);
            case "<" -> cb.lessThan(path, value);
            case "=" -> cb.equal(path, value);
            case "!=" -> cb.notEqual(path, value);
            default -> throw new IllegalArgumentException("Invalid numeric operator: " + operator);
        };
    }

    private Predicate buildStringPredicate(Path<String> path, String operator, String value, CriteriaBuilder cb) {
        return switch (operator) {
            case "=" -> cb.equal(path, value);
            case "!=" -> cb.notEqual(path, value);
            case "contains" -> cb.like(cb.lower(path), "%" + value.toLowerCase() + "%");
            default -> throw new IllegalArgumentException("Invalid string operator: " + operator);
        };
    }

    private Predicate buildDatePredicate(Path<LocalDate> path, String operator, LocalDate date, CriteriaBuilder cb) {
        return switch (operator) {
            case "<" -> cb.lessThan(path, date);
            case ">" -> cb.greaterThan(path, date);
            case "=" -> cb.equal(path, date);
            case "!=" -> cb.notEqual(path, date);
            default -> throw new IllegalArgumentException("Invalid date operator: " + operator);
        };
    }
}
