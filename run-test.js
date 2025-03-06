// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });
// Run the test
require('tsx')('./test-models.ts');
