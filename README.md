# 🐱 Whisker Budget

## Project Description

Whisker Budget is a web application designed to help prospective and current cat owners estimate and plan for the annual costs of cat care. This tool breaks down expenses into categories like food, healthcare, toys, and other essentials, providing users with a realistic budget for their feline companion.

Built with modern web technologies, the application offers a seamless user experience, complete with user accounts to save and revisit estimates, accessibility features, and detailed tooltips explaining each expense category.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Technologies Used

This project is built with the following technologies:

- **Framework**: [Next.js](https://nextjs.org/) (latest version)
- **UI Library**: [React](https://react.dev/) 19.0.0
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 3.4.17
- **Database**: [Supabase](https://supabase.com/) (latest version)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) 7.54.2
- **Form Validation**: [Zod](https://zod.dev/) 3.24.2
- **UI Components**: [Radix UI](https://www.radix-ui.com/) (various components)
- **TypeScript**: 5.7.2
- **Icons**: [Lucide React](https://lucide.dev/) 0.468.0
- **Theming**: [Next Themes](https://github.com/pacocoursey/next-themes) 0.4.3
- **API Fetching**: [TanStack Query](https://tanstack.com/query) (react-query)

**Utility Libraries**:
- [clsx](https://github.com/lukeed/clsx) 2.1.1
- [class-variance-authority](https://cva.style/docs) 0.7.0
- [tailwind-merge](https://github.com/dcastil/tailwind-merge) 2.6.0

**Development Tools**:
- [Prettier](https://prettier.io/) 3.3.3
- [PostCSS](https://postcss.org/) 8.4.49

## Features

- **Cost Estimation**: Calculate annual costs for cat ownership based on various factors
- **Expense Breakdown**: View detailed breakdowns of costs by category
- **User Accounts**: Save and retrieve cost estimates with Supabase authentication
- **Responsive Design**: Fully responsive interface that works on mobile, tablet, and desktop
- **Accessibility**: Follows WCAG guidelines
- **Dark/Light Mode**: Theme toggle for user preference
- **Tooltips**: Detailed informational tooltips explaining each expense category
- **Form Validation**: Client-side validation using Zod and React Hook Form

## Requirements

- Node.js 18.x or higher
- npm, yarn, or pnpm
- A Supabase account for database and authentication

## Installation

1. Clone the repository:

```bash
git clone https://github.com/jessica-iacovozzi/next-cat-cost-estimator.git
cd next-cat-cost-estimator
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials


4. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Creating an estimate**:
   - Fill out the cat information form
   - Submit to see your total annual estimate

2. **Saving estimates** (requires account):
   - Create an account or log in
   - Save your estimate for future reference
   - View and edit saved estimates from your profile

3. **Understanding costs**:
   - Hover over the information icons to see detailed explanations

## Project Structure

```
├── app/              # Next.js App Router pages and layouts
├── components/       # Reusable React components
├── lib/             # Utility functions and shared code
├── hooks/           # Custom React hooks
├── supabase/        # Supabase client and configuration
├── types/           # TypeScript type definitions
└── utils/           # Utility functions and shared code
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions about this project, please:

- Open an issue in the GitHub repository
- Contact me at [iacovozzi.jessica@gmail.com]
- Visit the project website at [https://www.whiskerbudget.ca/]

