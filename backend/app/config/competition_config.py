class CompetitionConfig:
    MAX_DURATION_MINUTES = 180
    DEFAULT_PARTICIPANT_LIMIT = 500
    AUTOSAVE_INTERVAL_SECONDS = 30
    SESSION_EXPIRATION_BUFFER_SECONDS = 60 # Allow 1 minute grace period for network latency on submit
    
    # Leaderboard rules
    LIVE_LEADERBOARD_UPDATE_INTERVAL_SECONDS = 15
    
    # Result visibility defaults
    DEFAULT_RESULT_VISIBILITY = "after_competition"
    DEFAULT_LEADERBOARD_VISIBILITY = "live"

competition_config = CompetitionConfig()
