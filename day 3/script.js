let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

function searchNotes(word) {
  const searchTerm = word.toLowerCase();
  return notes.filter(note => note.text.toLowerCase().includes(searchTerm));
}

function longestNote() {
  if (notes.length === 0) return null;
  return notes.reduce((longest, current) => 
    current.text.length > longest.text.length ? current : longest
  );
}

function countByCategory() {
  const counts = {};
  for (let note of notes) {
    counts[note.category] = (counts[note.category] || 0) + 1;
  }
  return counts;
}

function getSummary() {
  const counts = countByCategory();
  const categoryEntries = Object.entries(counts);
  const categoryString = categoryEntries.map(([cat, count]) => `${count} ${cat}`).join(", ");
  const noteWord = notes.length === 1 ? "note" : "notes";
  return `${notes.length} ${noteWord}: ${categoryString}.`;
}

function isDuplicate(text) {
  const normalizedText = text.trim().toLowerCase();
  return notes.some(note => note.text.trim().toLowerCase() === normalizedText);
}

function addNote(text, category) {
  const validCategories = ["personal", "work", "study"];
  
  if (typeof text !== "string" || text.length < 1 || text.length > 200) {
    console.log(`Failed to add: Text must be between 1 and 200 characters.`);
    return false;
  }
  if (!validCategories.includes(category)) {
    console.log(`Failed to add: Invalid category '${category}'.`);
    return false;
  }
  if (isDuplicate(text)) {
    console.log(`Failed to add: Note is a duplicate.`);
    return false;
  }

  const newId = notes.length > 0 ? notes[notes.length - 1].id + 1 : 1;
  notes.push({ id: newId, text: text.trim(), category });
  console.log(`Successfully added note.`);
  return true;
}

console.log("--- Testing searchNotes ---");
console.log(searchNotes("report")); // Expected: [{ id: 3, text: "Email the project report to Grace", category: "work" }]
console.log(searchNotes("xyz"));    // Expected: []

console.log("--- Testing longestNote ---");
console.log(longestNote()); // Expected: { id: 3, text: "Email the project report to Grace", category: "work" }

console.log("--- Testing countByCategory ---");
console.log(countByCategory()); // Expected: { personal: 2, study: 2, work: 1 }

console.log("--- Testing getSummary ---");
console.log(getSummary()); // Expected: "5 notes: personal 2, study 2, work 1." (or matching object key order)

console.log("--- Testing isDuplicate ---");
console.log(isDuplicate("call mum"));             // Expected: true
console.log(isDuplicate("Learn something new"));  // Expected: false

console.log("--- Testing addNote ---");
console.log(addNote("Buy milk and bread", "personal")); // Expected: false (duplicate), logs reason
console.log(addNote("Clean the kitchen", "personal"));   // Expected: true, logs success