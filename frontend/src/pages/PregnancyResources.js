import React, { useEffect, useState } from "react";
import { Loader } from "lucide-react";

const resourceStyle = {
  article: { backgroundColor: "#e0f7fa", textColor: "#00acc1" },
  video: { backgroundColor: "#ffe0b2", textColor: "#f57c00" },
  book: { backgroundColor: "#dcedc8", textColor: "#689f38" },
  website: { backgroundColor: "#f8bbd0", textColor: "#d81b60" },
};

export default function PregnancyResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const articles = resources.filter((res) => res.type === "article");
  const videos = resources.filter((res) => res.type === "video");
  const otherResources = resources.filter((res) => res.type !== "article" && res.type !== "video");

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/resources");
      if (!response.ok) throw new Error("Failed to fetch resources");

      const data = await response.json();
      setResources(data.resources || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
      setError("Unable to load resources. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const renderResourceSection = (title, resourceList) => (
    resourceList.length > 0 && (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resourceList.map((res, index) => {
            const style = resourceStyle[res.type] || { backgroundColor: "#f0f0f0", textColor: "#333" };

            return (
              <a
                key={index}
                href={res.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/80 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 flex flex-col"
              >
                <div className="p-4 flex-grow flex items-center justify-center" style={{ backgroundColor: style.backgroundColor }}>
                  <h3 className="text-lg font-semibold text-center" style={{ color: style.textColor }}>
                    {res.title}
                  </h3>
                </div>
                <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
                  <span className="inline-block py-2 px-4 text-sm font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-200 focus:outline-none focus:ring-gray-400">
                    Visit
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    )
  );

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto p-6 rounded-xl shadow-md bg-white w-4/5">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Explore Helpful Pregnancy Resources
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader className="animate-spin w-12 h-12 text-purple-500" />
            <p className="ml-4 text-purple-500">Loading resources...</p>
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div>
            {renderResourceSection("Articles", articles)}
            {renderResourceSection("Videos", videos)}
            {renderResourceSection("Other Resources", otherResources)}
          </div>
        )}

        {resources.length > 12 && (
          <div className="text-center mt-8">
            <button
              onClick={() => {
                // Implement load more functionality
              }}
              className="py-3 px-6 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 font-semibold transition-colors duration-200"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}