
// Find the problematic code at line 602 and fix it
// The issue is that Badge component doesn't accept "success" as a valid variant

// Original code with error (line 602):
// <Badge variant={supplier.is_active ? "success" : "secondary"}>

// Updated solution:
export const correctedBadgeCode = (isActive: boolean) => {
  // Instead of using variant="success" which doesn't exist, use className to style it
  return isActive ? (
    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300">
      Active
    </Badge>
  ) : (
    <Badge variant="secondary">
      Inactive
    </Badge>
  );
};

// The actual fix should be used in the Suppliers.tsx file like:
// {correctedBadgeCode(supplier.is_active)}
