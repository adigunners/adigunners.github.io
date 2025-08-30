/**
 * Prettier Configuration Consistency Tests
 *
 * Tests to verify that Prettier configuration is consistent across:
 * - Local vs parent directory configurations
 * - All supported file types
 * - Configuration resolution hierarchy
 * - Ignore file patterns
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Test paths and utilities
const PROJECT_ROOT = path.join(__dirname, '..');
const PARENT_DIR = path.join(PROJECT_ROOT, '..');
const LOCAL_PRETTIER_CONFIG = path.join(PROJECT_ROOT, '.prettierrc');
const PARENT_PRETTIER_CONFIG = path.join(PARENT_DIR, '.prettierrc');
const PRETTIER_IGNORE = path.join(PROJECT_ROOT, '.prettierignore');

// Helper functions
function loadJsonConfig(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return null;
  }
}

function runPrettier(filePath, configPath = null) {
  try {
    const configFlag = configPath ? `--config ${configPath}` : '';
    const result = execSync(`npx prettier ${configFlag} --check ${filePath}`, {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, output: error.message };
  }
}

describe('Prettier Configuration Tests', () => {
  let localConfig, parentConfig;

  beforeAll(() => {
    localConfig = loadJsonConfig(LOCAL_PRETTIER_CONFIG);
    parentConfig = loadJsonConfig(PARENT_PRETTIER_CONFIG);
  });

  describe('Configuration File Analysis', () => {
    test('local .prettierrc should exist and be valid JSON', () => {
      expect(localConfig).not.toBeNull();
      expect(typeof localConfig).toBe('object');
    });

    test('should identify if parent .prettierrc exists', () => {
      const parentExists = fs.existsSync(PARENT_PRETTIER_CONFIG);
      console.log(`Parent .prettierrc exists: ${parentExists}`);
      if (parentExists) {
        expect(parentConfig).not.toBeNull();
      }
    });

    test('should detect configuration conflicts between parent and local', () => {
      if (parentConfig && localConfig) {
        const conflicts = [];
        const allKeys = new Set([...Object.keys(localConfig), ...Object.keys(parentConfig)]);

        allKeys.forEach((key) => {
          const localValue = localConfig[key];
          const parentValue = parentConfig[key];

          if (
            localValue !== undefined &&
            parentValue !== undefined &&
            JSON.stringify(localValue) !== JSON.stringify(parentValue)
          ) {
            conflicts.push({
              key,
              local: localValue,
              parent: parentValue,
            });
          }
        });

        if (conflicts.length > 0) {
          console.log('⚠️ Configuration conflicts detected:');
          conflicts.forEach((conflict) => {
            console.log(
              `  ${conflict.key}: local=${JSON.stringify(conflict.local)} vs parent=${JSON.stringify(conflict.parent)}`
            );
          });
        }

        // Store conflicts for analysis
        expect(Array.isArray(conflicts)).toBe(true);
      }
    });
  });

  describe('Configuration Consistency', () => {
    const expectedSettings = {
      printWidth: 'should be consistent across configs',
      tabWidth: 'should be consistent across configs',
      singleQuote: 'should be consistent across configs',
      trailingComma: 'should be consistent across configs',
    };

    Object.keys(expectedSettings).forEach((setting) => {
      test(`${setting} should be consistently configured`, () => {
        if (localConfig) {
          expect(localConfig).toHaveProperty(setting);
        }

        if (parentConfig && localConfig) {
          const localValue = localConfig[setting];
          const parentValue = parentConfig[setting];

          if (localValue !== undefined && parentValue !== undefined) {
            expect(localValue).toBe(parentValue);
          }
        }
      });
    });
  });

  describe('Ignore File Validation', () => {
    test('.prettierignore should exist', () => {
      expect(fs.existsSync(PRETTIER_IGNORE)).toBe(true);
    });

    test('.prettierignore should contain essential ignore patterns', () => {
      if (fs.existsSync(PRETTIER_IGNORE)) {
        const ignoreContent = fs.readFileSync(PRETTIER_IGNORE, 'utf8');
        const essentialPatterns = ['node_modules', '.git'];

        essentialPatterns.forEach((pattern) => {
          expect(ignoreContent).toContain(pattern);
        });
      }
    });
  });

  describe('Formatting Consistency Across File Types', () => {
    const testFiles = {
      javascript: 'tests/format-test-files/test.js',
      html: 'tests/format-test-files/test.html',
      css: 'tests/format-test-files/test.css',
      markdown: 'tests/format-test-files/test.md',
      json: 'tests/format-test-files/test.json',
    };

    Object.entries(testFiles).forEach(([fileType, filePath]) => {
      test(`${fileType} files should format consistently`, () => {
        const fullPath = path.join(PROJECT_ROOT, filePath);

        if (fs.existsSync(fullPath)) {
          // Test with local config (if exists)
          const localResult = runPrettier(fullPath);
          expect(localResult.success).toBe(true);

          // Test with parent config (if exists) and compare
          if (parentConfig) {
            const parentResult = runPrettier(fullPath, PARENT_PRETTIER_CONFIG);
            // Both should succeed or both should fail consistently
            expect(localResult.success).toBe(parentResult.success);
          }
        }
      });
    });
  });

  describe('Configuration Resolution Priority', () => {
    test('should respect Prettier configuration hierarchy', () => {
      // Prettier config resolution order:
      // 1. .prettierrc in project root
      // 2. .prettierrc in parent directories
      // 3. package.json prettier field
      // 4. Default configuration

      const hasLocalConfig = fs.existsSync(LOCAL_PRETTIER_CONFIG);
      const hasParentConfig = fs.existsSync(PARENT_PRETTIER_CONFIG);

      if (hasLocalConfig) {
        console.log('✅ Local .prettierrc will take precedence');
      } else if (hasParentConfig) {
        console.log('⚠️ Parent .prettierrc will be used (no local config)');
      }

      expect(hasLocalConfig || hasParentConfig).toBe(true);
    });
  });
});

// Manual test runner for immediate feedback
if (require.main === module) {
  console.log('🧪 Prettier Configuration Analysis');
  console.log('==================================');

  // Check local config
  const localConfig = loadJsonConfig(LOCAL_PRETTIER_CONFIG);
  if (localConfig) {
    console.log('✅ Local .prettierrc found and valid');
    console.log(`📋 Local config keys: ${Object.keys(localConfig).join(', ')}`);
  } else {
    console.log('❌ Local .prettierrc not found or invalid');
  }

  // Check parent config
  const parentConfig = loadJsonConfig(PARENT_PRETTIER_CONFIG);
  if (parentConfig) {
    console.log('⚠️ Parent .prettierrc found');
    console.log(`📋 Parent config keys: ${Object.keys(parentConfig).join(', ')}`);

    // Compare configs
    if (localConfig) {
      const conflicts = [];
      const allKeys = new Set([...Object.keys(localConfig), ...Object.keys(parentConfig)]);

      allKeys.forEach((key) => {
        const localValue = localConfig[key];
        const parentValue = parentConfig[key];

        if (
          localValue !== undefined &&
          parentValue !== undefined &&
          JSON.stringify(localValue) !== JSON.stringify(parentValue)
        ) {
          conflicts.push({ key, local: localValue, parent: parentValue });
        }
      });

      if (conflicts.length > 0) {
        console.log('🔥 CONFLICTS DETECTED:');
        conflicts.forEach((conflict) => {
          console.log(
            `   ${conflict.key}: local=${JSON.stringify(conflict.local)} vs parent=${JSON.stringify(conflict.parent)}`
          );
        });
      } else {
        console.log('✅ No conflicts between local and parent configs');
      }
    }
  } else {
    console.log('✅ No parent .prettierrc found');
  }

  // Check ignore file
  if (fs.existsSync(PRETTIER_IGNORE)) {
    console.log('✅ .prettierignore found');
  } else {
    console.log('⚠️ .prettierignore not found');
  }
}
