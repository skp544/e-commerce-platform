## <a name="tech-stack">⚙️ Tech Stack</a>

- Next.js
- React.js
- Tailwind CSS
- Node.js
- TypeScript
- MySQL
- Clerk

# <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/skp544/e-commerce-platform.git
cd e-commerce-platform
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=

CLERK_WEBHOOK_SIGNING_SECRET=

DATABASE_URL="mysql://root:1234@localhost:3306/ecommerce"

NEXT_PUBLIC_CLOUDINARY_PRESET_NAME=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

Replace the values with your actual credentials

**Running the Project**

```bash
npm run dev
```