class RecommendationConfig:
    # Thresholds
    MINIMUM_DATA_ACTIVITIES = 3  # Minimum activities required to confidently assess a trend/weakness
    WEAK_SCORE_THRESHOLD = 60.0  # Scores below this trigger improvement recommendations
    STRONG_SCORE_THRESHOLD = 85.0  # Scores above this trigger maintenance recommendations
    DECLINING_TREND_DIFF = -5.0  # Drop in recent average to trigger review
    
    # Limits
    MAX_ACTIVE_RECOMMENDATIONS = 5
    
    # Priorities Mapping
    PRIORITY_CRITICAL = "critical"
    PRIORITY_HIGH = "high"
    PRIORITY_MEDIUM = "medium"
    PRIORITY_LOW = "low"

    # Confidences Mapping
    CONFIDENCE_HIGH = "high"
    CONFIDENCE_MEDIUM = "medium"
    CONFIDENCE_LOW = "low"

recommendation_config = RecommendationConfig()
