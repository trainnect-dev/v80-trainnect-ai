#!/bin/bash
# Load environment variables from .env.local
export $(grep -v '^#' .env.local | xargs)
# Run the test
npx tsx test-models.ts
