const { exec } = require("child_process")

console.log("Starting database seeding...")

// Run the TypeScript seed script using ts-node
exec("npx ts-node --project tsconfig.json scripts/seed-db.ts", (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`)
    return
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`)
    return
  }
  console.log(stdout)
  console.log("Database seeding completed successfully!")
})
