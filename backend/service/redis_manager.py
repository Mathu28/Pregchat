import redis
import json
from datetime import datetime

class RedisSessionManager:
    def __init__(self, redis_host='54.82.92.229', redis_port=6379):
        try:
            self.r = redis.Redis(host=redis_host, port=redis_port, decode_responses=True)
            self.r.ping()  # Check if connection is successful
            print("Connected to Redis!")
        except redis.exceptions.ConnectionError as e:
            print(f"Redis connection failed: {e}")
            raise

    def _key(self, user_id, unique_id):
        return f"pregchat:session:user:{user_id}:{unique_id}"

    def create_permanent_session(self, user_id: str, data: dict, unique_id: str):
        now = datetime.now()
        timestamp = now.strftime('%Y-%m-%d-%H-%M-%S')

        # Add timestamp to the session data
        data["creation_timestamp"] = timestamp

        # Ensure 'question' is in the session data
        if "question" not in data or not data["question"]:
            data["question"] = "No question recorded"

        # Store session in Redis with unique ID
        redis_key = self._key(user_id, unique_id)
        self.r.set(redis_key, json.dumps(data))  # No expiration

        return {
            "message": "Permanent session created",
            "session_id": redis_key,
            "timestamp": timestamp
        }

    def get_sessions_sorted_by_timestamp(self, user_id: str):
        
        all_sessions = self.r.keys(f"pregchat:session:user:{user_id}:*")
        return all_sessions

    def rpush(self, key, value):
        """Push a value to a Redis list."""
        self.r.rpush(key, value)
