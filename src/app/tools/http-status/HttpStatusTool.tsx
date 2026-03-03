"use client";

import { useState, useMemo } from "react";

interface StatusCode {
  code: number;
  name: string;
  description: string;
  notes: string;
}

const STATUS_CODES: StatusCode[] = [
  // 1xx
  { code: 100, name: "Continue", description: "The server has received the request headers and the client should proceed.", notes: "Rarely used. Client sends request with Expect: 100-continue header." },
  { code: 101, name: "Switching Protocols", description: "The server agrees to switch protocols as requested by the client.", notes: "Used when upgrading HTTP to WebSocket (Upgrade: websocket header)." },
  { code: 102, name: "Processing", description: "The server has received and is processing the request, no response available yet.", notes: "WebDAV extension. Prevents client timeouts on long operations." },
  { code: 103, name: "Early Hints", description: "Used to return some response headers before final response.", notes: "Helps clients preload resources while the server prepares the full response." },
  // 2xx
  { code: 200, name: "OK", description: "The request succeeded.", notes: "Response body varies by method: GET returns the resource, POST returns the result." },
  { code: 201, name: "Created", description: "The request succeeded and a new resource was created.", notes: "Common after POST requests. Should include Location header pointing to new resource." },
  { code: 202, name: "Accepted", description: "The request has been received but not yet acted upon.", notes: "Used for async processing — the work may complete later." },
  { code: 203, name: "Non-Authoritative Information", description: "Returned metadata is not exactly the same as on the origin server.", notes: "Transformed proxy may return this. Can usually be treated as 200." },
  { code: 204, name: "No Content", description: "No content to send for this request, but headers may be useful.", notes: "Common for DELETE and PUT. Response must not include a body." },
  { code: 205, name: "Reset Content", description: "Tells the client to reset the document view which sent this request.", notes: "Used after form submission to reset form fields." },
  { code: 206, name: "Partial Content", description: "This response is sent when the Range header is sent from the client.", notes: "Enables resumable downloads and video streaming. Must include Content-Range header." },
  { code: 207, name: "Multi-Status", description: "Conveys information about multiple resources in a single response.", notes: "WebDAV extension. Body is XML containing status for each resource." },
  { code: 208, name: "Already Reported", description: "Members of a DAV binding have already been enumerated in a previous reply.", notes: "WebDAV extension. Used inside 207 Multi-Status responses." },
  { code: 226, name: "IM Used", description: "The server fulfilled a GET request for the resource, using delta encoding.", notes: "HTTP Delta Encoding (RFC 3229). Rarely used in practice." },
  // 3xx
  { code: 300, name: "Multiple Choices", description: "The request has more than one possible response.", notes: "User or user agent should choose. Rarely used — server usually picks one." },
  { code: 301, name: "Moved Permanently", description: "The URL of the requested resource has been changed permanently.", notes: "Browsers cache this. GET/HEAD may change method; POST should use 308 instead." },
  { code: 302, name: "Found", description: "The URI of requested resource has been changed temporarily.", notes: "Widely misused — browsers often change POST to GET. Use 307 to preserve method." },
  { code: 303, name: "See Other", description: "The server sends this response to direct the client to get the requested resource at another URI with a GET request.", notes: "Used after POST to redirect to a confirmation page (Post/Redirect/Get pattern)." },
  { code: 304, name: "Not Modified", description: "This is used for caching purposes — client's cached version is still valid.", notes: "Sent when If-Modified-Since or If-None-Match headers match. No body included." },
  { code: 307, name: "Temporary Redirect", description: "The URI of requested resource has been changed temporarily, and the same method will be used.", notes: "Like 302 but guarantees method is preserved. Use for non-GET temporary redirects." },
  { code: 308, name: "Permanent Redirect", description: "The resource is now permanently located at another URI, and the same method will be used.", notes: "Like 301 but guarantees method is preserved. Use for non-GET permanent redirects." },
  // 4xx
  { code: 400, name: "Bad Request", description: "The server cannot or will not process the request due to a client error.", notes: "Covers malformed syntax, invalid request framing, deceptive request routing." },
  { code: 401, name: "Unauthorized", description: "The client must authenticate itself to get the requested response.", notes: "Despite the name, this means 'unauthenticated'. Response must include WWW-Authenticate header." },
  { code: 402, name: "Payment Required", description: "Reserved for future use — originally intended for digital payment systems.", notes: "Not widely used in standards. Some APIs use it for usage limit exceeded." },
  { code: 403, name: "Forbidden", description: "The client does not have access rights to the content.", notes: "Server knows who you are (authenticated) but won't allow it. Don't reveal existence of resource if private." },
  { code: 404, name: "Not Found", description: "The server cannot find the requested resource.", notes: "Most common error. Can also mean server doesn't want to reveal why it refused." },
  { code: 405, name: "Method Not Allowed", description: "The request method is known by the server but is not supported by the target resource.", notes: "Response must include Allow header listing supported methods." },
  { code: 406, name: "Not Acceptable", description: "No content matching the accept headers sent in the request was found.", notes: "Server-side content negotiation failure. Check Accept, Accept-Language, Accept-Encoding headers." },
  { code: 407, name: "Proxy Authentication Required", description: "Authentication must be done by a proxy.", notes: "Similar to 401 but authentication must be performed by a proxy server." },
  { code: 408, name: "Request Timeout", description: "The server would like to shut down this unused connection.", notes: "Server decided to close idle connection. Client may reopen and send request again." },
  { code: 409, name: "Conflict", description: "This response is sent when a request conflicts with the current state of the server.", notes: "Common in APIs: optimistic locking conflicts, duplicate resource creation." },
  { code: 410, name: "Gone", description: "Access to the target resource is no longer available and will not return.", notes: "Permanent 404. Tells clients and search engines to remove the resource from caches/indexes." },
  { code: 411, name: "Length Required", description: "Server rejected the request because Content-Length header is not defined.", notes: "Add Content-Length header to the request." },
  { code: 412, name: "Precondition Failed", description: "The client has indicated preconditions in its headers which the server does not meet.", notes: "Returned when If-Match or If-Unmodified-Since conditions fail. Used for optimistic locking." },
  { code: 413, name: "Content Too Large", description: "Request entity is larger than limits defined by server.", notes: "Server may close connection or return Retry-After header. Formerly 'Request Entity Too Large'." },
  { code: 414, name: "URI Too Long", description: "The URI requested by the client is longer than the server is willing to interpret.", notes: "Often caused by GET request with very long query string. Use POST with body instead." },
  { code: 415, name: "Unsupported Media Type", description: "The media format of the requested data is not supported by the server.", notes: "Check Content-Type header. Common cause: sending JSON without application/json header." },
  { code: 416, name: "Range Not Satisfiable", description: "Ranges specified in Range header can't be fulfilled.", notes: "The range is outside the size of the data. Response should include Content-Range header." },
  { code: 417, name: "Expectation Failed", description: "The expectation indicated by the Expect request header cannot be met by the server.", notes: "Sent when Expect: 100-continue is not supported by server." },
  { code: 418, name: "I'm a Teapot", description: "The server refuses to brew coffee because it is, permanently, a teapot.", notes: "April Fools' joke from RFC 2324 (Hyper Text Coffee Pot Control Protocol). Kept as an easter egg." },
  { code: 421, name: "Misdirected Request", description: "The request was directed at a server that is not able to produce a response.", notes: "HTTP/2 connection reuse issue — server can't produce response for this combination of scheme + authority." },
  { code: 422, name: "Unprocessable Content", description: "The request was well-formed but had semantic errors.", notes: "Common in REST APIs for validation errors (e.g. invalid field value). Formerly 'Unprocessable Entity'." },
  { code: 423, name: "Locked", description: "The resource that is being accessed is locked.", notes: "WebDAV extension. Resource is locked using the LOCK method." },
  { code: 424, name: "Failed Dependency", description: "The request failed due to failure of a previous request.", notes: "WebDAV extension. Operation couldn't be performed because a dependent operation failed." },
  { code: 425, name: "Too Early", description: "The server is unwilling to risk processing a request that might be replayed.", notes: "Used with TLS 0-RTT (early data) to prevent replay attacks." },
  { code: 426, name: "Upgrade Required", description: "The server refuses to perform the request using the current protocol.", notes: "Response must include Upgrade header indicating the required protocol (e.g. TLS/1.0)." },
  { code: 428, name: "Precondition Required", description: "The origin server requires the request to be conditional.", notes: "Prevents lost-update problems. Require If-Match or If-Unmodified-Since on updates." },
  { code: 429, name: "Too Many Requests", description: "The user has sent too many requests in a given amount of time.", notes: "Rate limiting. Response should include Retry-After header with wait time." },
  { code: 431, name: "Request Header Fields Too Large", description: "The server is unwilling to process the request because its header fields are too large.", notes: "Individual header too large or total headers too large. Common with very large cookies." },
  { code: 451, name: "Unavailable For Legal Reasons", description: "Resource cannot legally be provided, such as due to legal demands or censorship.", notes: "Named after Fahrenheit 451. Should include Link header referencing the legal authority." },
  // 5xx
  { code: 500, name: "Internal Server Error", description: "The server encountered an unexpected condition that prevented it from fulfilling the request.", notes: "Catch-all for server-side errors. Check server logs for the actual cause." },
  { code: 501, name: "Not Implemented", description: "The request method is not supported by the server and cannot be handled.", notes: "GET and HEAD must never return this. Only method or feature is unimplemented." },
  { code: 502, name: "Bad Gateway", description: "The server, while working as a gateway to get a response, got an invalid response.", notes: "Upstream server returned an invalid response. Common when reverse proxy can't reach backend." },
  { code: 503, name: "Service Unavailable", description: "The server is not ready to handle the request. Common causes: maintenance or overloaded.", notes: "Temporary. Should include Retry-After header. Used for graceful shutdowns and maintenance windows." },
  { code: 504, name: "Gateway Timeout", description: "The server is acting as a gateway and cannot get a response from the upstream server in time.", notes: "Upstream server is too slow. Check for database timeouts, slow third-party APIs, or overloaded backends." },
  { code: 505, name: "HTTP Version Not Supported", description: "The HTTP version used in the request is not supported by the server.", notes: "Rare in practice. Most servers support HTTP/1.1 and HTTP/2." },
  { code: 506, name: "Variant Also Negotiates", description: "Internal server configuration error — chosen variant is itself configured to engage in content negotiation.", notes: "Circular content negotiation. Caused by misconfigured Transparent Content Negotiation." },
  { code: 507, name: "Insufficient Storage", description: "The server is unable to store the representation needed to complete the request.", notes: "WebDAV extension. Server has run out of disk space." },
  { code: 508, name: "Loop Detected", description: "The server terminated an operation because it encountered an infinite loop while processing a request.", notes: "WebDAV extension. Prevents infinite loops during COPY or MOVE operations." },
  { code: 510, name: "Not Extended", description: "Further extensions to the request are required for the server to fulfill it.", notes: "Rare. The server needs more policy extensions than the request contains." },
  { code: 511, name: "Network Authentication Required", description: "Indicates that the client needs to authenticate to gain network access.", notes: "Captive portals (hotel/airport Wi-Fi) use this to redirect to login pages." },
];

type CategoryKey = "1xx" | "2xx" | "3xx" | "4xx" | "5xx";

const CATEGORY_INFO: Record<CategoryKey, { label: string; color: string; bg: string; border: string }> = {
  "1xx": { label: "Informational", color: "text-[#79c0ff]", bg: "bg-[#0d2137]", border: "border-[#1f6feb]" },
  "2xx": { label: "Success", color: "text-[#3fb950]", bg: "bg-[#0d2a1a]", border: "border-[#238636]" },
  "3xx": { label: "Redirection", color: "text-[#d2a8ff]", bg: "bg-[#1e1230]", border: "border-[#6e40c9]" },
  "4xx": { label: "Client Error", color: "text-[#ffa657]", bg: "bg-[#2a1a0d]", border: "border-[#9e6a03]" },
  "5xx": { label: "Server Error", color: "text-[#f85149]", bg: "bg-[#2a0d0d]", border: "border-[#da3633]" },
};

function getCategory(code: number): CategoryKey {
  if (code < 200) return "1xx";
  if (code < 300) return "2xx";
  if (code < 400) return "3xx";
  if (code < 500) return "4xx";
  return "5xx";
}

export default function HttpStatusTool() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryKey | "all">("all");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return STATUS_CODES.filter((s) => {
      const matchesSearch = !q ||
        s.code.toString().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q);
      const matchesCategory = activeCategory === "all" || getCategory(s.code) === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const grouped = useMemo(() => {
    const groups: Record<CategoryKey, StatusCode[]> = { "1xx": [], "2xx": [], "3xx": [], "4xx": [], "5xx": [] };
    filtered.forEach((s) => groups[getCategory(s.code)].push(s));
    return groups;
  }, [filtered]);

  const categories: CategoryKey[] = ["1xx", "2xx", "3xx", "4xx", "5xx"];

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code or name… (e.g. 404, redirect, timeout)"
          className="flex-1 rounded border border-[#30363d] bg-[#0d1117] px-3 py-2.5 text-sm text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:border-[#3b82f6]"
        />
        <button
          onClick={() => { setSearch(""); setActiveCategory("all"); }}
          className="text-sm text-[#484f58] hover:text-[#8b949e] transition-colors whitespace-nowrap"
        >
          Reset
        </button>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            activeCategory === "all"
              ? "bg-[#1e3a5f] text-[#3b82f6] border-[#1e3a5f]"
              : "text-[#8b949e] border-[#30363d] hover:border-[#484f58]"
          }`}
        >
          All
        </button>
        {categories.map((cat) => {
          const info = CATEGORY_INFO[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                activeCategory === cat
                  ? `${info.bg} ${info.color} ${info.border}`
                  : "text-[#8b949e] border-[#30363d] hover:border-[#484f58]"
              }`}
            >
              {cat} — {info.label}
            </button>
          );
        })}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-[#484f58]">
          No status codes match your search.
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => {
            const codes = grouped[cat];
            if (codes.length === 0) return null;
            const info = CATEGORY_INFO[cat];
            return (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-bold font-mono ${info.color}`}>{cat}</span>
                  <span className="text-xs font-semibold text-[#8b949e]">{info.label}</span>
                  <span className="text-xs text-[#484f58]">({codes.length})</span>
                </div>
                <div className="rounded border border-[#30363d] overflow-hidden">
                  {codes.map((s, i) => {
                    const isExpanded = expanded === s.code;
                    return (
                      <div
                        key={s.code}
                        className={i < codes.length - 1 ? "border-b border-[#21262d]" : ""}
                      >
                        <button
                          onClick={() => setExpanded(isExpanded ? null : s.code)}
                          className="w-full flex items-start gap-4 px-4 py-3 text-left hover:bg-[#1c2128] transition-colors"
                        >
                          <span className={`font-mono font-bold text-sm w-10 shrink-0 ${info.color}`}>
                            {s.code}
                          </span>
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-sm text-[#e6edf3]">{s.name}</span>
                            {!isExpanded && (
                              <p className="text-xs text-[#8b949e] mt-0.5 line-clamp-1">{s.description}</p>
                            )}
                          </div>
                          <svg
                            className={`w-3.5 h-3.5 text-[#484f58] shrink-0 mt-0.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {isExpanded && (
                          <div className={`px-4 pb-4 pt-0 ${info.bg} border-t border-[#21262d]`}>
                            <p className="text-sm text-[#e6edf3] mt-3">{s.description}</p>
                            <p className="text-xs text-[#8b949e] mt-2 leading-relaxed">{s.notes}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
