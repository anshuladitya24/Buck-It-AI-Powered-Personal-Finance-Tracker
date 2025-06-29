import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignIn 
      appearance={{
        elements: {
          headerTitle: "Sign in to Buck-It",
          headerSubtitle: "Welcome back! Please sign in to continue"
        }
      }}
    />
  );
}
