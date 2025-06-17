# GitHub Copilot Instructions for Tick'Help

## 🤖 What is GitHub Copilot?

GitHub Copilot is an AI-powered programming assistant that helps you write code faster and more efficiently. It's a tool developed by GitHub and OpenAI that uses advanced language models to generate code suggestions based on your comments and your project context.

## 🚀 Setting up for the Tick'Help Project

### Installing GitHub Copilot

1. **Install the VS Code extension**
   - Open VS Code and go to the Extensions tab (Ctrl+Shift+X)
   - Search for "GitHub Copilot" and install the extension
   - You can also install GitHub Copilot Chat for enhanced interaction capabilities

2. **Authentication**
   - Sign in with your GitHub account that has an active GitHub Copilot subscription

## 💡 Best Practices for Using Copilot in this Project

### 1. Writing Descriptive Comments

Write clear comments describing what you want to accomplish before letting Copilot generate code:

```javascript
// Create a function that filters tickets by status and priority
// It should accept an array of tickets and filter parameters
// Returns a new filtered array without modifying the original
```

### 2. Use JSDoc for Main Functions

```javascript
/**
 * Filter tickets based on multiple criteria
 * @param {Array} tickets - Array of tickets to filter
 * @param {Object} filters - Filter criteria
 * @param {string} [filters.status] - Ticket status
 * @param {string} [filters.priority] - Ticket priority
 * @param {string} [filters.assignee] - Assignee user ID
 * @return {Array} Filtered array of tickets
 */
```

### 3. Naming Conventions for Better Generation

Follow these naming conventions to optimize suggestions:

- **React Components**: `UserTicketList`, `TicketDetailCard`
- **Custom Hooks**: `useTicketData`, `useAuthentication` 
- **API Services**: `ticketService`, `authService`
- **Controllers**: `ticketController`, `userController`

### 4. API Route Structure

Use this structure to help Copilot generate routes correctly:

```javascript
// Ticket routes
// GET /api/tickets - List all tickets
// GET /api/tickets/:id - Get ticket details
// POST /api/tickets - Create new ticket
// PUT /api/tickets/:id - Update a ticket
// DELETE /api/tickets/:id - Delete a ticket
```

### 5. Model Schemas

Provide complete descriptions for your models:

```javascript
// Ticket Model
// - id: string (uuid)
// - title: string (required)
// - description: string
// - status: enum ['todo', 'in_progress', 'resolved']
// - priority: enum ['low', 'medium', 'high', 'critical']
// - assignee_id: string (uuid, foreign key to Users)
// - created_by: string (uuid, foreign key to Users)
// - created_at: date
// - updated_at: date
```

## 🛠️ Useful Copilot Commands

### Keyboard Shortcuts

- **Accept suggestion**: `Tab`
- **Next suggestion**: `Alt + ]` or `Option + ]` (Mac)
- **Previous suggestion**: `Alt + [` or `Option + [` (Mac)
- **Dismiss suggestion**: `Esc`
- **Trigger inline suggestions**: `Alt + \` or `Option + \` (Mac)
- **Open Copilot Chat**: `Ctrl + Shift + I` or `Cmd + Shift + I` (Mac)

### Copilot Chat Commands

- `/help`: Display available commands
- `/tests`: Generate tests for your selected code
- `/explain`: Explain selected code
- `/fix`: Suggest fixes for selected code
- `/docs`: Generate documentation for selected code

## ⚠️ Limitations and Precautions

- **Always review generated code** for security and best practices
- **Don't use for sensitive data** (passwords, API keys)
- **Avoid copying large blocks** without understanding how they work
- **Thoroughly test** generated code to detect errors

## 🌟 Tasks Where Copilot Excels in the Tick'Help Project

- Creating reusable React components
- Generating form validators
- Writing client-side API requests
- Setting up Express middlewares
- Creating Jest unit tests
- Setting up Express routes
- Defining database schemas

## 📋 Project Summary

Tick'Help is a comprehensive ticket management application developed as part of the DEVE427 module. The project uses:

- **Frontend**: React.js with Vite
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
- **Testing**: Jest for backend, React Testing Library for frontend
- **CI/CD**: GitHub Actions
- **Deployment**: Render, Railway, or Netlify

With these instructions, your team can use GitHub Copilot optimally to develop the Tick'Help application while maintaining good development practices.
