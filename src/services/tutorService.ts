import { DifficultyLevel } from '../types';

export interface TutorTeachingContent {
  topic: string;
  briefExplanation: string;
  intuitiveExplanation: string;
  practicalExample: string;
  codeSnippet?: string;
  easyMnemonic: string;
  importantTip: string;
  targetedPracticeQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const DETERMINISTIC_TUTOR_TOPICS: Record<string, TutorTeachingContent> = {
  'binary trees': {
    topic: 'Binary Trees',
    briefExplanation: 'A Binary Tree is a hierarchical non-linear data structure where each parent node has at most two children, typically referred to as the left child and right child.',
    intuitiveExplanation: 'Imagine an upside-down family tree or an organizational decision chart where every single manager is only allowed to supervise at most two team leads. If a manager has zero leads, they are a "leaf" at the bottom of the tree.',
    practicalExample: 'Used in DOM hierarchies in web browsers, expression evaluation trees in compilers (e.g. `(3 + 4) * 5`), and autocomplete prefix tries.',
    codeSnippet: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};`,
    easyMnemonic: '"Binary = Bi (Two)": At most 2 children. Root on top, leaves on bottom.',
    importantTip: 'Do not confuse a general Binary Tree with a Binary Search Tree (BST). In a general binary tree, nodes can appear in any order. In a BST, values strictly follow: Left < Root < Right.',
    targetedPracticeQuestion: {
      question: 'What is the maximum number of children any node can have in a Binary Tree?',
      options: ['1', '2', '3', 'Unlimited'],
      correctIndex: 1,
      explanation: 'By formal definition, a binary tree restricts the branching factor to at most two child nodes (left and right).',
    },
  },

  'binary search trees': {
    topic: 'Binary Search Trees (BST)',
    briefExplanation: 'A Binary Search Tree is a binary tree where every node obeys the ordering property: all values in the left subtree are strictly less than the root value, and all values in the right subtree are strictly greater.',
    intuitiveExplanation: 'Think of looking up a name in an alphabetized phone book. You open right to the middle. If the name you want comes earlier in the alphabet, you instantly discard the entire right half of the book. BSTs do this recursively!',
    practicalExample: 'In-memory indexing, dictionary key lookups, and maintaining dynamically sorted streams where elements arrive continuously.',
    codeSnippet: `bool searchBST(TreeNode* root, int target) {
    if (!root) return false;
    if (root->val == target) return true;
    if (target < root->val) return searchBST(root->left, target);
    return searchBST(root->right, target);
}`,
    easyMnemonic: '"L-R-O": Left is Lesser, Right is Risin\' (Greater).',
    importantTip: 'If elements are inserted into a BST in already sorted order (e.g. 1, 2, 3, 4, 5), the tree degrades into a straight linked list with O(N) lookup instead of O(log N). Self-balancing trees (AVL / Red-Black) prevent this.',
    targetedPracticeQuestion: {
      question: 'Which tree traversal algorithm visits nodes of a BST in ascending numerical order?',
      options: ['Pre-order', 'In-order', 'Post-order', 'Breadth-First Search'],
      correctIndex: 1,
      explanation: 'In-order traversal visits Left Subtree -> Root -> Right Subtree, perfectly mirroring the Left < Root < Right BST invariant.',
    },
  },

  'arrays': {
    topic: 'Arrays & Memory Layout',
    briefExplanation: 'An array is a linear data structure storing fixed-size elements of the same data type in contiguous memory locations.',
    intuitiveExplanation: 'Think of a row of numbered lockers in a gymnasium hallway, positioned side-by-side without any gaps. If you know Locker #0 is at address 1000 and each locker is 4 feet wide, Locker #5 is mathematically at `1000 + 5 * 4 = 1020` without walking through lockers 1 to 4.',
    practicalExample: 'Pixel buffers in GPU framebuffers, audio sample processing, and internal storage for dynamic vectors and hash table buckets.',
    codeSnippet: `int arr[5] = {10, 20, 30, 40, 50};
// Direct constant-time pointer arithmetic:
// Address = BaseAddress + index * sizeof(int)
int val = arr[3]; // O(1) random access`,
    easyMnemonic: '"C-C-C": Contiguous, Constant-time lookup, Cache-friendly.',
    importantTip: 'Because array memory is contiguous, modern CPU hardware caches prefetches adjacent array elements into L1/L2 cache, making array iterations dramatically faster in practice than linked lists.',
    targetedPracticeQuestion: {
      question: 'Why does accessing an element by index in an array take O(1) constant time?',
      options: [
        'Because arrays use binary search on indices',
        'Because the memory address is calculated with a single mathematical equation: base + index * size',
        'Because array items are cached in CPU registers automatically',
        'Because the operating system keeps a pointer to every index',
      ],
      correctIndex: 1,
      explanation: 'Contiguous memory allows the CPU to compute the exact memory address instantaneously without traversing intermediate nodes.',
    },
  },

  'linked lists': {
    topic: 'Linked Lists',
    briefExplanation: 'A linear collection of data elements called nodes, where each node stores a data value and a pointer (or reference) to the subsequent node in memory.',
    intuitiveExplanation: 'Think of a scavenger hunt: clue #1 doesn\'t sit next to clue #2 in physical space. Instead, clue #1 contains a slip of paper telling you the exact GPS coordinates of clue #2. You cannot jump directly to clue #5 without following each coordinate in sequence.',
    practicalExample: 'Underlying implementation of music playlists (Next/Previous song), browser history back/forward caches (Doubly Linked List), and operating system free-memory blocks.',
    codeSnippet: `struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};`,
    easyMnemonic: '"Nodes with Roads": Each node holds data and points the road to the next stop.',
    importantTip: 'Inserting or deleting a node at the head is O(1) with zero element shifting. However, finding the Kth element is strictly O(K) because you cannot perform index arithmetic.',
    targetedPracticeQuestion: {
      question: 'What is the primary advantage of a Singly Linked List over a standard fixed-size Array?',
      options: [
        'O(1) random index access',
        'Lower total memory usage per element',
        'Dynamic size with O(1) head insertions without shifting elements',
        'Better CPU cache locality',
      ],
      correctIndex: 2,
      explanation: 'Linked lists do not require pre-allocated contiguous memory blocks; they grow dynamically on the heap without shifting downstream elements.',
    },
  },

  'stacks': {
    topic: 'Stacks & LIFO Behavior',
    briefExplanation: 'A linear data structure following the Last-In, First-Out (LIFO) principle, where insertions and deletions happen exclusively at one end called the top.',
    intuitiveExplanation: 'Think of a spring-loaded stack of clean dinner plates in a cafeteria. The last plate placed on top of the stack is the first plate taken by the next customer.',
    practicalExample: 'The function Call Stack in programming languages, Undo/Redo features in text editors, and syntax bracket checking (`{ [ ( ) ] }`).',
    codeSnippet: `std::stack<int> s;
s.push(10);
s.push(20);
int topVal = s.top(); // returns 20
s.pop();              // removes 20`,
    easyMnemonic: '"LIFO": Last In, First Out. Like a stack of pancakes.',
    importantTip: 'Always check `!stack.empty()` before calling `top()` or `pop()` to prevent runtime underflow exceptions.',
    targetedPracticeQuestion: {
      question: 'Which computer science process relies fundamentally on a call stack?',
      options: ['Round-robin CPU scheduling', 'Recursive function execution', 'Dijkstra shortest path queue', 'Hash table collision chaining'],
      correctIndex: 1,
      explanation: 'When a function calls itself recursively, its activation record (local variables and return address) is pushed onto the call stack.',
    },
  },

  'graphs': {
    topic: 'Graphs & Traversals',
    briefExplanation: 'A non-linear data structure consisting of a finite set of vertices (or nodes) connected by edges (which may be directed, undirected, weighted, or unweighted).',
    intuitiveExplanation: 'Think of a flight network or social network: airports (or people) are vertices, and direct flight routes (or friendships) are edges connecting them. Some routes are one-way (directed), and some flights have distances/costs (weights).',
    practicalExample: 'Google Maps GPS navigation, social network friend recommendations, package dependency resolvers (npm / pip), and network packet routing.',
    codeSnippet: `// Adjacency List representation:
vector<vector<int>> adj(V);
adj[u].push_back(v); // directed edge u -> v
adj[v].push_back(u); // if undirected`,
    easyMnemonic: '"V & E": Vertices are islands, Edges are bridges.',
    importantTip: 'In graph traversals (BFS & DFS), ALWAYS maintain a `visited` boolean array or hash set. Unlike trees, graphs can contain cycles, which will cause infinite recursion loops without a visited check.',
    targetedPracticeQuestion: {
      question: 'Which traversal algorithm guarantees finding the shortest path between two nodes in an unweighted graph?',
      options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'Post-order traversal', 'In-order traversal'],
      correctIndex: 1,
      explanation: 'Because BFS explores in expanding concentric rings level-by-level (distance 1, distance 2, etc.), the first time it reaches a target node is guaranteed to be the shortest path in unweighted graphs.',
    },
  },

  'sql': {
    topic: 'SQL & Relational Queries',
    briefExplanation: 'Structured Query Language (SQL) is the standardized domain-specific declarative language used to manage, query, and manipulate data stored in relational database management systems (RDBMS).',
    intuitiveExplanation: 'Think of a spreadsheet workbook where each sheet has strict column headers and defined data types. Instead of manually clicking and filtering rows, you write an English-like instruction specifying WHAT data you want, and the database optimizer decides HOW to fetch it.',
    practicalExample: 'Querying student grade transcripts, e-commerce order filtering, bank account balance verification, and analytics reporting.',
    codeSnippet: `SELECT department_id, COUNT(*) AS student_count
FROM students
WHERE semester = 2
GROUP BY department_id
HAVING COUNT(*) > 30
ORDER BY student_count DESC;`,
    easyMnemonic: '"SWEET GLORY HAVE SUNDAY": SELECT, WHERE, GROUP BY, HAVING, ORDER BY.',
    importantTip: 'Remember the logical execution order differs from written syntax! The DB engine processes: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT.',
    targetedPracticeQuestion: {
      question: 'Which SQL clause is used to filter aggregated data results AFTER a `GROUP BY` grouping?',
      options: ['WHERE', 'HAVING', 'FILTER', 'ORDER BY'],
      correctIndex: 1,
      explanation: 'WHERE filters individual raw rows before grouping; HAVING filters aggregated groups after the GROUP BY calculation.',
    },
  },

  'normalization': {
    topic: 'Database Normalization (1NF to BCNF)',
    briefExplanation: 'The process of organizing data in a database to reduce data redundancy, eliminate update/insertion/deletion anomalies, and ensure data dependencies make logical sense.',
    intuitiveExplanation: 'Imagine writing a customer\'s home address in 50 different rows of an order ledger. If the customer moves, you must update 50 rows (Update Anomaly). If you miss one, data is corrupted. Normalization splits the customer into a separate table referenced by an ID.',
    practicalExample: 'Enterprise ERP systems, financial ledger databases, and student university registration portals.',
    codeSnippet: `// 1NF: Atomic columns (no lists in cells)
// 2NF: 1NF + No partial dependencies on composite keys
// 3NF: 2NF + No transitive dependencies (Non-key -> Non-key)
// BCNF: For every X -> Y, X must be a superkey!`,
    easyMnemonic: '"Every attribute must depend on the key, the whole key, and nothing but the key, so help me Codd."',
    importantTip: 'Higher normalization forms (3NF/BCNF) save storage and prevent anomalies, but require more table JOINs during queries. In read-heavy OLAP systems, intentional de-normalization is sometimes used for speed.',
    targetedPracticeQuestion: {
      question: 'What type of dependency does Second Normal Form (2NF) specifically eliminate?',
      options: ['Transitive dependency', 'Partial functional dependency on a composite primary key', 'Multivalued dependency', 'Cyclic dependency'],
      correctIndex: 1,
      explanation: '2NF requires that every non-prime attribute is fully functionally dependent on the entire primary key, eliminating partial dependencies.',
    },
  },

  'tcp vs udp': {
    topic: 'Transport Protocols: TCP vs UDP',
    briefExplanation: 'TCP (Transmission Control Protocol) is connection-oriented, reliable, and byte-stream-based with error checking and flow control. UDP (User Datagram Protocol) is connectionless, lightweight, and transmits datagrams without guaranteed delivery or ordering.',
    intuitiveExplanation: 'TCP is like a certified postal letter with return-receipt signature verification: if a page is dropped in the rain, the sender re-mails it until confirmed. UDP is like a live megaphone broadcast in a stadium: fast, low latency, but if someone coughs and misses a word, the speaker doesn\'t stop to repeat it.',
    practicalExample: 'TCP: Web browsing (HTTP/HTTPS), email (SMTP), file transfers (FTP/SSH). UDP: Live video streaming (Twitch/YouTube Live), online multiplayer gaming, DNS queries, VoIP calls.',
    codeSnippet: `// TCP: 3-Way Handshake (SYN -> SYN-ACK -> ACK)
// TCP Features: Sequencing, Retransmission, Flow Control (Window), Congestion Control
// UDP: Header size only 8 bytes (vs TCP minimum 20 bytes), No connection overhead`,
    easyMnemonic: '"TCP = Thorough, Checked, Protected. UDP = Urgent, Direct, Prompt."',
    importantTip: 'UDP is not "inferior" to TCP; it is chosen intentionally when low latency is strictly more important than 100% packet arrival (e.g. in real-time gaming, an old delayed coordinate packet is useless).',
    targetedPracticeQuestion: {
      question: 'Why do competitive multiplayer online games typically prefer UDP over TCP for player movement packets?',
      options: [
        'UDP provides built-in encryption',
        'UDP eliminates TCP retransmission delays and head-of-line blocking for real-time responsiveness',
        'UDP packets are always guaranteed to arrive in order',
        'TCP cannot transmit numbers',
      ],
      correctIndex: 1,
      explanation: 'TCP holds up all incoming data until dropped packets are retransmitted (head-of-line blocking). For player position, the newest coordinate is all that matters, so UDP latency advantage is critical.',
    },
  },
};

/**
 * Fallback teaching generator for any CSE topic
 */
export function getDeterministicTeaching(topicQuery: string, difficulty: DifficultyLevel = 'Medium'): TutorTeachingContent {
  const normalized = topicQuery.toLowerCase().trim();

  for (const [key, content] of Object.entries(DETERMINISTIC_TUTOR_TOPICS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return content;
    }
  }

  // Generic fallback if topic is not pre-mapped
  return {
    topic: topicQuery,
    briefExplanation: `${topicQuery} is an essential concept in B.Tech Computer Science and Engineering curriculum. It builds upon foundational algorithmic paradigms and architectural principles.`,
    intuitiveExplanation: `Think of ${topicQuery} as a modular building block in software systems that balances computational time complexity against memory consumption.`,
    practicalExample: `Widely utilized across modern operating systems, high-performance distributed backends, and technical interview evaluations at top engineering firms.`,
    easyMnemonic: `Focus on: 1) What problem does it solve? 2) What are its time/space trade-offs? 3) What is its primary edge case?`,
    importantTip: `Always test edge cases (empty inputs, single-element collections, and extreme bounds) when working with ${topicQuery}.`,
    targetedPracticeQuestion: {
      question: `In evaluating ${topicQuery}, which consideration is most fundamental when architecting scalable systems?`,
      options: [
        'Algorithmic time complexity (Big-O) and space efficiency',
        'Visual aesthetic of the source code',
        'Using the newest programming language syntax',
        'Avoiding comments in the codebase',
      ],
      correctIndex: 0,
      explanation: 'Asymptotic complexity dictates how algorithms scale as data sets grow from thousands to millions of records.',
    },
  };
}

/**
 * Call Server-Side AI Tutor API
 * (Express proxy that invokes Gemini if GEMINI_API_KEY is present,
 * or gracefully returns the rich deterministic educational teaching)
 */
export async function fetchAITutorExplanation(
  topic: string,
  userPrompt: string,
  studentContext: { branch: string; semester: number; mastery: number; difficulty: DifficultyLevel }
): Promise<TutorTeachingContent> {
  try {
    const response = await fetch('/api/tutor/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic,
        userPrompt,
        studentContext,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.teaching) {
        return data.teaching;
      }
    }
  } catch {
    // Network or server offline -> graceful deterministic fallback
  }

  return getDeterministicTeaching(topic || userPrompt, studentContext.difficulty);
}

export interface TutorResponse {
  topic: string;
  briefExplanation: string;
  intuitiveAnalogy: string;
  practicalExample: string;
  easyMnemonic: string;
  proTip: string;
  practiceCheck: string;
}

export async function askAITutor(
  topic: string,
  depth: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate',
  branch: string = 'CSE'
): Promise<TutorResponse> {
  const content = await fetchAITutorExplanation(topic, topic, {
    branch,
    semester: 2,
    mastery: depth === 'Beginner' ? 40 : depth === 'Advanced' ? 85 : 65,
    difficulty: depth === 'Beginner' ? 'Easy' : depth === 'Advanced' ? 'Hard' : 'Medium',
  });

  return {
    topic: content.topic,
    briefExplanation: content.briefExplanation,
    intuitiveAnalogy: content.intuitiveExplanation,
    practicalExample: content.codeSnippet
      ? `${content.practicalExample}\n\n${content.codeSnippet}`
      : content.practicalExample,
    easyMnemonic: content.easyMnemonic,
    proTip: content.importantTip,
    practiceCheck: content.targetedPracticeQuestion.question,
  };
}

