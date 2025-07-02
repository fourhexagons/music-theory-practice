# Assistant Mandatory Prompt (Copy-Paste for Cursor)

Use this prompt when working with assistants to ensure they read documentation before any investigation:

---

🛑 **STOP - MANDATORY PROCESS BEFORE ANY INVESTIGATION**

Before you investigate ANY code or suggest ANY solutions:

1. **COMPLETE DOCUMENTATION REVIEW**
   READ EVERY FILE in docs/ COMPLETELY:
   - docs/SYSTEMATIC_RESEARCH_METHODOLOGY.md
   - docs/DOCUMENTATION_MAINTENANCE_PROTOCOL.md  
   - docs/RESEARCH_TEMPLATE.md
   - docs/DEVELOPMENT.md
   - docs/URL_CONFIGURATION.md
   - docs/LEARNING_PATH_PROTECTION.md
   - ALL other docs/ files

2. **CONFIRM UNDERSTANDING** 
   Respond: "I have read all documentation in docs/ completely and understand the methodology."

3. **ENVIRONMENT SETUP PHASE**
   Respond: "I am now setting up my development environment according to documented protocols."

4. **COMPLIANCE VERIFICATION**
   You MUST run and report results:
   - Command: `npm run verify-dev-env`
   - Paste the complete output (success or failure)
   - State: "Environment verification complete" (only if verification passes)

5. **GIT WORKFLOW VERIFICATION**
   You MUST run and report results:
   - Command: `npm run git:verify`
   - Paste the complete output showing git state analysis
   - Follow any automated workflow recommendations
   - State: "Git workflow verified" (only after reviewing output)

6. **INVESTIGATION PERMISSION**
   Only after steps 1-5, respond: "All protocols verified. I am ready to begin systematic investigation."

⚠️ **CRITICAL**: Steps 2-6 must be separate responses. No investigation may begin until step 6 is completed.

🎯 **WHY**: Previous assistants who skipped doc reading wasted hours on wrong assumptions, broke working code, and violated critical protocols. Reading docs first prevents this and leads to faster, correct solutions.

**Your next response should ONLY be confirmation that you've read all docs, nothing else.**

---

## Usage Instructions

1. Copy the prompt above (between the --- lines)
2. Paste as first message when starting work with any assistant
3. Do not proceed until assistant confirms they've read all docs
4. If assistant begins investigation without confirmation, stop them and repeat the prompt 