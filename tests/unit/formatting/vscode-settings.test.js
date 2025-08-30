/**
 * VSCode Settings Configuration Tests
 *
 * Tests to verify that VSCode settings are properly configured for:
 * - Valid JSON syntax
 * - Language-specific formatter assignments
 * - Format-on-save functionality
 * - Prettier integration
 */

const fs = require('fs');
const path = require('path');

// Test data and utilities
const VSCODE_SETTINGS_PATH = path.join(__dirname, '..', '.vscode', 'settings.json');
const SUPPORTED_FILE_TYPES = [
  'markdown',
  'javascript',
  'javascriptreact',
  'typescript',
  'typescriptreact',
  'html',
  'css',
  'json',
];

describe('VSCode Settings Configuration', () => {
  let settings;

  beforeAll(() => {
    // Load and parse VSCode settings
    try {
      const settingsContent = fs.readFileSync(VSCODE_SETTINGS_PATH, 'utf8');
      settings = JSON.parse(settingsContent);
    } catch (error) {
      settings = null;
    }
  });

  describe('JSON Syntax Validation', () => {
    test('settings.json should have valid JSON syntax', () => {
      expect(settings).not.toBeNull();
      expect(typeof settings).toBe('object');
    });

    test('should not have nested language configurations', () => {
      // Check that no language-specific config is nested inside another
      const languageKeys = Object.keys(settings).filter(
        (key) => key.startsWith('[') && key.endsWith(']')
      );

      languageKeys.forEach((langKey) => {
        const config = settings[langKey];
        if (typeof config === 'object') {
          const nestedLangKeys = Object.keys(config).filter(
            (key) => key.startsWith('[') && key.endsWith(']')
          );
          expect(nestedLangKeys).toHaveLength(0);
        }
      });
    });
  });

  describe('Format-on-Save Configuration', () => {
    test('global formatOnSave should be enabled', () => {
      expect(settings['editor.formatOnSave']).toBe(true);
    });

    test('prettier.requireConfig should be enabled', () => {
      expect(settings['prettier.requireConfig']).toBe(true);
    });

    test('prettier.useEditorConfig should be enabled', () => {
      expect(settings['prettier.useEditorConfig']).toBe(true);
    });
  });

  describe('Language-Specific Formatter Configuration', () => {
    test('all supported file types should have Prettier as default formatter', () => {
      SUPPORTED_FILE_TYPES.forEach((fileType) => {
        const langKey = `[${fileType}]`;

        expect(settings).toHaveProperty(langKey);
        expect(settings[langKey]).toHaveProperty('editor.defaultFormatter');
        expect(settings[langKey]['editor.defaultFormatter']).toBe('esbenp.prettier-vscode');
      });
    });

    test('markdown should have additional wordWrap configuration', () => {
      const markdownConfig = settings['[markdown]'];
      expect(markdownConfig).toHaveProperty('editor.wordWrap');
      expect(markdownConfig['editor.wordWrap']).toBe('on');
    });

    test('no language config should override global formatOnSave unless necessary', () => {
      SUPPORTED_FILE_TYPES.forEach((fileType) => {
        const langKey = `[${fileType}]`;
        const config = settings[langKey];

        // Only markdown should explicitly set formatOnSave
        if (fileType === 'markdown') {
          expect(config).toHaveProperty('editor.formatOnSave', true);
        } else {
          // Other languages should not override global setting
          expect(config).not.toHaveProperty('editor.formatOnSave');
        }
      });
    });
  });

  describe('Configuration Completeness', () => {
    test('should have configurations for all project file types', () => {
      // Based on project structure, ensure we have configs for all used file types
      const expectedConfigs = [
        '[html]', // index.html, winners.html
        '[css]', // css/ directory files
        '[javascript]', // js/ directory files
        '[json]', // package.json, data/*.json
        '[markdown]', // README.md, docs/*.md
      ];

      expectedConfigs.forEach((configKey) => {
        expect(settings).toHaveProperty(configKey);
      });
    });

    test('should not have unnecessary language configurations', () => {
      // Ensure we don't have configs for languages not used in this project
      const unnecessaryConfigs = ['[python]', '[java]', '[php]', '[ruby]'];

      unnecessaryConfigs.forEach((configKey) => {
        expect(settings).not.toHaveProperty(configKey);
      });
    });
  });
});

// Mock test runner output for manual verification
if (require.main === module) {
  console.log('🧪 VSCode Settings Tests');
  console.log('========================');

  try {
    const settingsContent = fs.readFileSync(VSCODE_SETTINGS_PATH, 'utf8');
    const settings = JSON.parse(settingsContent);

    console.log('✅ JSON syntax is valid');
    console.log('✅ Settings loaded successfully');
    console.log(`📋 Found ${Object.keys(settings).length} configuration keys`);

    // Check for nested language configs (the main issue)
    const languageKeys = Object.keys(settings).filter(
      (key) => key.startsWith('[') && key.endsWith(']')
    );
    const hasNestedConfigs = languageKeys.some((langKey) => {
      const config = settings[langKey];
      if (typeof config === 'object') {
        const nestedLangKeys = Object.keys(config).filter(
          (key) => key.startsWith('[') && key.endsWith(']')
        );
        return nestedLangKeys.length > 0;
      }
      return false;
    });

    if (hasNestedConfigs) {
      console.log('❌ CRITICAL: Found nested language configurations');
      console.log('🔧 This will prevent proper formatter assignment');
    } else {
      console.log('✅ No nested language configurations found');
    }
  } catch (error) {
    console.log('❌ FAILED: JSON syntax error in settings.json');
    console.log(`💥 Error: ${error.message}`);
  }
}
