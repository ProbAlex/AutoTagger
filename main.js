const { Plugin, Notice } = require('obsidian');

module.exports = class AutoTaggerPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: 'auto-tag-note-with-ollama',
      name: 'Auto-tag current note',
      callback: () => this.tagCurrentNote()
    });
  }

  async tagCurrentNote() {
    const file = this.app.workspace.getActiveFile();
    if (!file) {
      new Notice('No active file');
      return;
    }

    const content = await this.app.vault.read(file);
    const tags = await this.getTagsFromOllama(content);
    if (!tags) {
      new Notice('No tags returned from Ollama');
      return;
    }

    const updated = this.updateFrontmatter(content, tags);
    await this.app.vault.modify(file, updated);
    new Notice('Tags added!');
  }

  async getTagsFromOllama(content) {
    const response = await fetch('https://ai.alexalex.net/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral',
        prompt: `Extract 5-7 relevant tags for this note. Respond only with comma-separated tags.\n\n${content}`
      })
    });

    if (!response.ok) return null;

    const reader = response.body?.getReader();
    let result = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += new TextDecoder().decode(value);
    }

    const match = result.match(/"response":"([^"]+)"/);
    const tagText = match ? match[1] : result;

    return tagText
      .split(',')
      .map(t => t.trim().replace(/^#+/, ''))
      .filter(t => t.length > 0);
  }

  updateFrontmatter(content, tags) {
    const yamlRegex = /^---\n([\s\S]*?)\n---\n?/;
    let yamlMatch = content.match(yamlRegex);
    let yaml = '';
    let body = content;

    if (yamlMatch) {
      yaml = yamlMatch[1];
      body = content.slice(yamlMatch[0].length);
    }

    let tagLine = `tags: [${tags.map(tag => `"${tag}"`).join(', ')}]`;
    const newYaml = yaml.includes('tags:')
      ? yaml.replace(/tags:.*\n?/, tagLine + '\n')
      : yaml + '\n' + tagLine + '\n';

    return `---\n${newYaml}---\n${body}`;
  }
};
