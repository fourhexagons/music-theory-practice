# Assistant Mandatory Prompt (Copy-Paste for Cursor)

Use this prompt when working with assistants to ensure they read documentation before any investigation:

---

🛑 **STOP - MANDATORY PROCESS BEFORE ANY INVESTIGATION**

Before you investigate ANY code or suggest ANY solutions:

1. **READ EVERY FILE in docs/ COMPLETELY** 
   - docs/SYSTEMATIC_RESEARCH_METHODOLOGY.md
   - docs/DOCUMENTATION_MAINTENANCE_PROTOCOL.md  
   - docs/RESEARCH_TEMPLATE.md
   - docs/DEVELOPMENT.md
   - docs/URL_CONFIGURATION.md
   - docs/LEARNING_PATH_PROTECTION.md
   - ALL other docs/ files

2. **CONFIRM YOUR READING** by responding: "I have read all documentation in docs/ completely and understand the methodology."

3. **ONLY THEN** may you begin investigation.

⚠️ **WARNING**: Any investigation, code examination, or solution suggestions made WITHOUT first reading all docs completely will be rejected and you'll be asked to restart from step 1.

🎯 **WHY**: Previous assistants who skipped doc reading wasted hours on wrong assumptions, broke working code, and violated critical protocols. Reading docs first prevents this and leads to faster, correct solutions.

**Your next response should ONLY be confirmation that you've read all docs, nothing else.**

---

## Usage Instructions

1. Copy the prompt above (between the --- lines)
2. Paste as first message when starting work with any assistant
3. Do not proceed until assistant confirms they've read all docs
4. If assistant begins investigation without confirmation, stop them and repeat the prompt 