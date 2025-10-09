"use client";

import { useState } from "react";
import { FaStar, FaSearch } from "react-icons/fa";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ListItemClient({
  data,
  url,
}: {
  data: any[];
  url: string;
}) {
  
  const [items, setItems] = useState<Array<any>>(
    Array.isArray(data) ? data : []
  );
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [query, setQuery] = useState("");

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const isNowFavorite = !prev[id];
      const newFav = { ...prev, [id]: isNowFavorite };

      if (isNowFavorite) {
        setItems((prevItems) => {
          if (!Array.isArray(prevItems)) return [];
          const index = prevItems.findIndex((item) => item.id === id);
          if (index === -1) return prevItems;
          const updated = [...prevItems];
          const [item] = updated.splice(index, 1);
          return [item, ...updated];
        });
      }

      return newFav;
    });
  };

  const filteredItems = (Array.isArray(items) ? items : []).filter((org) =>
    String(org?.name || "")
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="mx-2">
      <div className="flex items-center bg-white p-2 rounded-md shadow-sm mt-2 mb-4">
        <input
          type="text"
          placeholder="Хайх"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 outline-none px-2 text-black"
        />
        <button
          onClick={() => setQuery("")}
          className="p-2 text-gray-500 hover:text-gray-800 transition"
        >
          <FaSearch />
        </button>
      </div>

      <ul>
        <AnimatePresence>
          {filteredItems.map((org) => {
            const isFavorited = favorites[org.id] || false;

            return (
              <motion.li
                key={org.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col bg-white mt-3 px-2 py-4 rounded-sm text-black"
              >
                <div className="flex items-center">
                  <div
                    onClick={() => toggleFavorite(org.id)}
                    className="text-yellow-700 mx-2 cursor-pointer transition-transform duration-300"
                  >
                    <div
                      className={`transition-transform duration-300 ${
                        isFavorited ? "scale-110" : ""
                      }`}
                    >
                      <FaStar
                        color={isFavorited ? "yellow" : "gray"}
                        size={20}
                      />
                    </div>
                  </div>

                  <Link href={`/${url}/${org.id}`} className="hover:underline">
                    {org.name}
                  </Link>
                </div>

                {org.budget && (
                  <div className="relative mt-3 w-full h-2 bg-green-200 rounded-full transition-all">
                    <div
                      className="absolute h-2 bg-green-400 rounded-full transition-all"
                      style={{
                        width: `${(org.current / org.budget) * 100 || 0}%`,
                      }}
                    ></div>
                  </div>
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
