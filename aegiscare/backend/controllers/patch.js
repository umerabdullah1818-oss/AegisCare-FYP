const fs = require('fs');
const path = require('path');

const p = path.join('c:', 'Users', 'Umer', 'Desktop', 'fyp development', 'aegiscare', 'backend', 'controllers', 'adminController.js');

let d = fs.readFileSync(p, 'utf8');

const regex = /const result = await User\.deleteMany\(\{ status: 'inactive' \}\);\s*res\.status\(200\)\.json\(\{ success: true, message: `\$\{result\.deletedCount\} inactive users removed`, count: result\.deletedCount \}\);/;

const replacement = `const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const result = await User.deleteMany({ 
      status: 'inactive', 
      $or: [
        { lastLogin: { $lte: thirtyDaysAgo } },
        { lastLogin: null, createdAt: { $lte: thirtyDaysAgo } }
      ]
    });

    if (result.deletedCount > 0) {
      await Notification.create({
        recipientId: req.user._id,
        recipientModel: 'Admin',
        type: 'general',
        title: 'System Cleanup',
        message: \`System automatically pruned \${result.deletedCount} users inactive for > 30 days.\`
      });
    }

    res.status(200).json({ success: true, message: \`\${result.deletedCount} inactive users removed\`, count: result.deletedCount });`;

if (regex.test(d)) {
    console.log("Found match! Replacing...");
    fs.writeFileSync(p, d.replace(regex, replacement));
} else {
    console.log("Could not find match using regex!");
}
