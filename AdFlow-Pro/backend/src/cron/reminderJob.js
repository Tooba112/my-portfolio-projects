const cron = require("node-cron");
const Order = require("../models/Order");

// Runs every day at midnight (0 0 * * *)
// For demo purposes, also runs every minute so it's visible during viva
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("[CRON] Running daily order reminder check...");

    // Find orders that are still "pending" and older than 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const staleOrders = await Order.find({
      status: "pending",
      createdAt: { $lt: oneDayAgo }
    }).populate("client", "name email");

    if (staleOrders.length === 0) {
      console.log("[CRON] No stale pending orders found.");
      return;
    }

    console.log(`[CRON] Found ${staleOrders.length} stale pending order(s):`);

    staleOrders.forEach((order) => {
      // In a real app, you would send an email here using nodemailer
      // For now, we log the reminder
      console.log(
        `[CRON] Reminder: Order #${order._id} for client "${order.client?.name}" (${order.client?.email}) has been pending since ${order.createdAt.toDateString()}`
      );
    });

  } catch (error) {
    console.error("[CRON] Error in reminder job:", error.message);
  }
});

// Demo cron: runs every minute just to show it's alive during viva
cron.schedule("* * * * *", () => {
  console.log("[CRON] AdFlow Pro heartbeat - cron is running");
});
