"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const SettingsPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen p-6 space-y-6 bg-zinc-50 dark:bg-zinc-950">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>

      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full border rounded p-2 bg-white dark:bg-zinc-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border rounded p-2 bg-white dark:bg-zinc-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border rounded p-2 bg-white dark:bg-zinc-800"
          />
        </div>

        <Button variant="default">Save Changes</Button>
      </div>
    </div>
  );
};

export default SettingsPage;



