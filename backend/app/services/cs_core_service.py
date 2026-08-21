import uuid
import json
from datetime import datetime
from typing import List, Dict, Optional
from app.schemas.technical import (
    TechnicalLanguage, CSSubject, CSTopic, TechnicalModule, 
    TechnicalQuestion, TechnicalSession, TechnicalResult,
    TechnicalDifficulty, TechnicalQuestionType
)
from app.services.gemini_service import gemini_service
from app.services.prompts.cs_core import get_cs_core_question_prompt

CS_SUBJECTS_DATA = [
    {
        "id": "data-structures",
        "name": "Data Structures",
        "description": "Arrays, Linked Lists, Trees, Graphs, and Hash Tables.",
        "icon": "database",
        "order": 1,
        "topics": [
            {"id": "arrays", "name": "Arrays", "desc": "Contiguous memory structures"},
            {"id": "linked_lists", "name": "Linked Lists", "desc": "Singly, doubly, and circular"},
            {"id": "stacks", "name": "Stacks", "desc": "LIFO structures"},
            {"id": "queues", "name": "Queues", "desc": "FIFO structures"},
            {"id": "circular_queue", "name": "Circular Queue", "desc": "Ring buffer implementation"},
            {"id": "hash_tables", "name": "Hash Tables", "desc": "Hashing and collision resolution"},
            {"id": "trees", "name": "Trees", "desc": "Hierarchical structures"},
            {"id": "binary_trees", "name": "Binary Trees", "desc": "Tree traversal and properties"},
            {"id": "bst", "name": "BST", "desc": "Binary Search Trees"},
            {"id": "heaps", "name": "Heaps", "desc": "Min and Max heaps"},
            {"id": "priority_queue", "name": "Priority Queue", "desc": "Heap applications"},
            {"id": "graphs", "name": "Graphs", "desc": "Vertices, edges, representations"},
            {"id": "tries", "name": "Tries", "desc": "Prefix trees"},
            {"id": "disjoint_set", "name": "Disjoint Set", "desc": "Union-Find algorithms"},
            {"id": "time_complexity", "name": "Time Complexity", "desc": "Big-O notation"},
            {"id": "space_complexity", "name": "Space Complexity", "desc": "Memory overhead"}
        ]
    },
    {
        "id": "algorithms",
        "name": "Algorithms",
        "description": "Searching, Sorting, Recursion, DP, and Graph Algorithms.",
        "icon": "activity",
        "order": 2,
        "topics": [
            {"id": "searching", "name": "Searching", "desc": "Search algorithms basics"},
            {"id": "linear_search", "name": "Linear Search", "desc": "Sequential search"},
            {"id": "binary_search", "name": "Binary Search", "desc": "Logarithmic search"},
            {"id": "sorting", "name": "Sorting", "desc": "Sorting properties"},
            {"id": "bubble_sort", "name": "Bubble Sort", "desc": "Comparison sort"},
            {"id": "selection_sort", "name": "Selection Sort", "desc": "In-place comparison"},
            {"id": "insertion_sort", "name": "Insertion Sort", "desc": "Online sorting"},
            {"id": "merge_sort", "name": "Merge Sort", "desc": "Divide and conquer"},
            {"id": "quick_sort", "name": "Quick Sort", "desc": "Partitioning"},
            {"id": "heap_sort", "name": "Heap Sort", "desc": "In-place O(n log n)"},
            {"id": "recursion", "name": "Recursion", "desc": "Base cases and calls"},
            {"id": "backtracking", "name": "Backtracking", "desc": "State space search"},
            {"id": "greedy", "name": "Greedy Algorithms", "desc": "Local optimum choices"},
            {"id": "divide_conquer", "name": "Divide and Conquer", "desc": "Recursive problem breaking"},
            {"id": "dp", "name": "Dynamic Programming", "desc": "Memoization and tabulation"},
            {"id": "graph_algos", "name": "Graph Algorithms", "desc": "Graph traversal basics"},
            {"id": "bfs", "name": "BFS", "desc": "Breadth-First Search"},
            {"id": "dfs", "name": "DFS", "desc": "Depth-First Search"},
            {"id": "shortest_path", "name": "Shortest Path", "desc": "Dijkstra, Bellman-Ford"},
            {"id": "mst", "name": "Minimum Spanning Tree", "desc": "Prim's and Kruskal's"},
            {"id": "algo_complexity", "name": "Complexity Analysis", "desc": "Master theorem"}
        ]
    },
    {
        "id": "dbms",
        "name": "DBMS",
        "description": "SQL, Normalization, ACID properties, and Transactions.",
        "icon": "server",
        "order": 3,
        "topics": [
            {"id": "dbms_basics", "name": "DBMS Basics", "desc": "Introduction to Databases"},
            {"id": "db_vs_dbms", "name": "Database vs DBMS", "desc": "Distinctions and definitions"},
            {"id": "relational_model", "name": "Relational Model", "desc": "Tuples and attributes"},
            {"id": "tables", "name": "Tables", "desc": "Relations and schemas"},
            {"id": "keys", "name": "Keys", "desc": "Key concepts"},
            {"id": "primary_key", "name": "Primary Key", "desc": "Unique identifiers"},
            {"id": "foreign_key", "name": "Foreign Key", "desc": "Referential integrity"},
            {"id": "candidate_key", "name": "Candidate Key", "desc": "Minimal super keys"},
            {"id": "super_key", "name": "Super Key", "desc": "Uniqueness constraint"},
            {"id": "normalization", "name": "Normalization", "desc": "Anomaly reduction"},
            {"id": "1nf", "name": "1NF", "desc": "Atomic values"},
            {"id": "2nf", "name": "2NF", "desc": "Partial dependencies"},
            {"id": "3nf", "name": "3NF", "desc": "Transitive dependencies"},
            {"id": "bcnf", "name": "BCNF", "desc": "Boyce-Codd Normal Form"},
            {"id": "sql", "name": "SQL", "desc": "Structured Query Language"},
            {"id": "select", "name": "SELECT", "desc": "Data retrieval"},
            {"id": "insert", "name": "INSERT", "desc": "Data creation"},
            {"id": "update", "name": "UPDATE", "desc": "Data modification"},
            {"id": "delete", "name": "DELETE", "desc": "Data removal"},
            {"id": "joins", "name": "JOINs", "desc": "Combining relations"},
            {"id": "inner_join", "name": "INNER JOIN", "desc": "Intersection joining"},
            {"id": "left_join", "name": "LEFT JOIN", "desc": "Left outer join"},
            {"id": "right_join", "name": "RIGHT JOIN", "desc": "Right outer join"},
            {"id": "subqueries", "name": "Subqueries", "desc": "Nested queries"},
            {"id": "aggregates", "name": "Aggregate Functions", "desc": "COUNT, SUM, AVG"},
            {"id": "group_by", "name": "GROUP BY", "desc": "Data aggregation"},
            {"id": "having", "name": "HAVING", "desc": "Group filtering"},
            {"id": "indexing", "name": "Indexing", "desc": "B-Trees, Hashing"},
            {"id": "transactions", "name": "Transactions", "desc": "State transitions"},
            {"id": "acid", "name": "ACID", "desc": "Atomicity, Consistency, Isolation, Durability"},
            {"id": "concurrency", "name": "Concurrency", "desc": "Simultaneous execution"},
            {"id": "locks", "name": "Locks", "desc": "Shared vs Exclusive"},
            {"id": "deadlocks", "name": "Deadlocks", "desc": "Circular wait"},
            {"id": "views", "name": "Views", "desc": "Virtual tables"},
            {"id": "stored_procedures", "name": "Stored Procedures", "desc": "Compiled queries"},
            {"id": "triggers", "name": "Triggers", "desc": "Event-driven actions"},
            {"id": "nosql", "name": "NoSQL Fundamentals", "desc": "Document, Key-Value"}
        ]
    },
    {
        "id": "os",
        "name": "Operating Systems",
        "description": "Processes, Memory Management, and Scheduling.",
        "icon": "cpu",
        "order": 4,
        "topics": [
            {"id": "os_basics", "name": "OS Basics", "desc": "Kernels and userspace"},
            {"id": "processes", "name": "Processes", "desc": "PCB and states"},
            {"id": "threads", "name": "Threads", "desc": "User vs Kernel threads"},
            {"id": "process_states", "name": "Process States", "desc": "Ready, Running, Blocked"},
            {"id": "context_switching", "name": "Context Switching", "desc": "State saving"},
            {"id": "scheduling", "name": "Scheduling", "desc": "CPU schedulers"},
            {"id": "fcfs", "name": "FCFS", "desc": "First Come First Serve"},
            {"id": "sjf", "name": "SJF", "desc": "Shortest Job First"},
            {"id": "round_robin", "name": "Round Robin", "desc": "Time slicing"},
            {"id": "priority_sched", "name": "Priority Scheduling", "desc": "Starvation and aging"},
            {"id": "synchronization", "name": "Synchronization", "desc": "Race conditions"},
            {"id": "critical_section", "name": "Critical Section", "desc": "Mutual exclusion"},
            {"id": "mutex", "name": "Mutex", "desc": "Locking mechanisms"},
            {"id": "semaphore", "name": "Semaphore", "desc": "Signaling mechanisms"},
            {"id": "os_deadlock", "name": "Deadlock", "desc": "Coffman conditions"},
            {"id": "deadlock_prev", "name": "Deadlock Prevention", "desc": "Condition negation"},
            {"id": "deadlock_avoid", "name": "Deadlock Avoidance", "desc": "Safe states"},
            {"id": "bankers", "name": "Banker's Algorithm", "desc": "Resource allocation graph"},
            {"id": "memory_mgmt", "name": "Memory Management", "desc": "Contiguous vs Non-contiguous"},
            {"id": "paging", "name": "Paging", "desc": "Page tables and TLB"},
            {"id": "segmentation", "name": "Segmentation", "desc": "Logical division"},
            {"id": "virtual_memory", "name": "Virtual Memory", "desc": "Demand paging"},
            {"id": "page_replacement", "name": "Page Replacement", "desc": "Page faults"},
            {"id": "fifo_pr", "name": "FIFO", "desc": "First In First Out (Pages)"},
            {"id": "lru", "name": "LRU", "desc": "Least Recently Used"},
            {"id": "thrashing", "name": "Thrashing", "desc": "High paging activity"},
            {"id": "file_systems", "name": "File Systems", "desc": "Inodes and FAT"},
            {"id": "io", "name": "I/O", "desc": "Polling vs Interrupts"},
            {"id": "system_calls", "name": "System Calls", "desc": "Mode switching"}
        ]
    },
    {
        "id": "networks",
        "name": "Computer Networks",
        "description": "OSI Model, TCP/IP, Routing, and Protocols.",
        "icon": "globe",
        "order": 5,
        "topics": [
            {"id": "network_basics", "name": "Networking Basics", "desc": "LAN, WAN, Topologies"},
            {"id": "osi", "name": "OSI Model", "desc": "7 Layer Architecture"},
            {"id": "tcp_ip", "name": "TCP/IP Model", "desc": "4 Layer Architecture"},
            {"id": "physical_layer", "name": "Physical Layer", "desc": "Signals and media"},
            {"id": "data_link", "name": "Data Link Layer", "desc": "Framing and MAC"},
            {"id": "network_layer", "name": "Network Layer", "desc": "Routing and IP"},
            {"id": "transport_layer", "name": "Transport Layer", "desc": "TCP and UDP"},
            {"id": "app_layer", "name": "Application Layer", "desc": "HTTP, FTP, SMTP"},
            {"id": "ip_addr", "name": "IP Addressing", "desc": "Classes and CIDR"},
            {"id": "ipv4", "name": "IPv4", "desc": "32-bit addresses"},
            {"id": "ipv6", "name": "IPv6", "desc": "128-bit addresses"},
            {"id": "subnetting", "name": "Subnetting", "desc": "Network division"},
            {"id": "tcp", "name": "TCP", "desc": "Connection-oriented protocol"},
            {"id": "udp", "name": "UDP", "desc": "Connectionless protocol"},
            {"id": "http", "name": "HTTP", "desc": "Stateless protocol"},
            {"id": "https", "name": "HTTPS", "desc": "Secure HTTP"},
            {"id": "dns", "name": "DNS", "desc": "Domain Name System"},
            {"id": "dhcp", "name": "DHCP", "desc": "Dynamic IP allocation"},
            {"id": "arp", "name": "ARP", "desc": "Address Resolution Protocol"},
            {"id": "icmp", "name": "ICMP", "desc": "Ping and Traceroute"},
            {"id": "routing", "name": "Routing", "desc": "Path selection"},
            {"id": "switching", "name": "Switching", "desc": "Circuit vs Packet"},
            {"id": "mac_addr", "name": "MAC Address", "desc": "Physical addressing"},
            {"id": "ports", "name": "Ports", "desc": "Logical endpoints"},
            {"id": "sockets", "name": "Sockets", "desc": "IP + Port"},
            {"id": "firewalls", "name": "Firewalls", "desc": "Packet filtering"},
            {"id": "nat", "name": "NAT", "desc": "Network Address Translation"},
            {"id": "net_sec", "name": "Network Security Fundamentals", "desc": "Basic defense"}
        ]
    },
    {
        "id": "oop",
        "name": "OOP",
        "description": "Object-Oriented Programming principles and design.",
        "icon": "box",
        "order": 6,
        "topics": [
            {"id": "class", "name": "Class", "desc": "Blueprints"},
            {"id": "object", "name": "Object", "desc": "Instances"},
            {"id": "oop_encapsulation", "name": "Encapsulation", "desc": "Data hiding"},
            {"id": "oop_abstraction", "name": "Abstraction", "desc": "Implementation hiding"},
            {"id": "oop_inheritance", "name": "Inheritance", "desc": "Code reusability"},
            {"id": "oop_polymorphism", "name": "Polymorphism", "desc": "Many forms"},
            {"id": "association", "name": "Association", "desc": "Object relationships"},
            {"id": "aggregation", "name": "Aggregation", "desc": "Has-A relationship (weak)"},
            {"id": "composition", "name": "Composition", "desc": "Part-Of relationship (strong)"},
            {"id": "method_overloading", "name": "Method Overloading", "desc": "Compile-time polymorphism"},
            {"id": "method_overriding", "name": "Method Overriding", "desc": "Run-time polymorphism"},
            {"id": "interface", "name": "Interface", "desc": "Contract definition"},
            {"id": "abstract_class", "name": "Abstract Class", "desc": "Partial implementation"},
            {"id": "constructor", "name": "Constructor", "desc": "Initialization"},
            {"id": "destructor", "name": "Destructor Concepts", "desc": "Cleanup"},
            {"id": "solid", "name": "SOLID Principles", "desc": "Design best practices"}
        ]
    },
    {
        "id": "software-engineering",
        "name": "Software Engineering",
        "description": "SDLC, Agile, Testing, and System Design.",
        "icon": "settings",
        "order": 7,
        "topics": [
            {"id": "sdlc", "name": "SDLC", "desc": "Software Development Life Cycle"},
            {"id": "waterfall", "name": "Waterfall", "desc": "Sequential design"},
            {"id": "agile", "name": "Agile", "desc": "Iterative development"},
            {"id": "scrum", "name": "Scrum", "desc": "Sprints and roles"},
            {"id": "kanban", "name": "Kanban", "desc": "Continuous delivery"},
            {"id": "requirements", "name": "Requirements", "desc": "Gathering and analysis"},
            {"id": "functional_req", "name": "Functional Requirements", "desc": "System behaviors"},
            {"id": "non_functional_req", "name": "Non-functional Requirements", "desc": "System qualities"},
            {"id": "software_design", "name": "Software Design", "desc": "High/Low level design"},
            {"id": "architecture", "name": "Architecture", "desc": "System structures"},
            {"id": "testing_basics", "name": "Testing Fundamentals", "desc": "V-Model and QA"},
            {"id": "unit_testing", "name": "Unit Testing", "desc": "Component validation"},
            {"id": "integration_testing", "name": "Integration Testing", "desc": "Interface validation"},
            {"id": "system_testing", "name": "System Testing", "desc": "End-to-end validation"},
            {"id": "regression_testing", "name": "Regression Testing", "desc": "Change validation"},
            {"id": "cicd", "name": "CI/CD", "desc": "Continuous Integration/Deployment"},
            {"id": "version_control", "name": "Version Control", "desc": "VCS concepts"},
            {"id": "git", "name": "Git Fundamentals", "desc": "Distributed VCS"},
            {"id": "maintenance", "name": "Software Maintenance", "desc": "Post-deployment"},
            {"id": "design_principles", "name": "Design Principles", "desc": "DRY, KISS, YAGNI"}
        ]
    },
    {
        "id": "computer-architecture",
        "name": "Computer Architecture",
        "description": "CPU Design, Memory Hierarchy, and Pipelining.",
        "icon": "hard-drive",
        "order": 8,
        "topics": [
            {"id": "comp_org", "name": "Computer Organization", "desc": "Von Neumann architecture"},
            {"id": "cpu", "name": "CPU", "desc": "Central Processing Unit"},
            {"id": "alu", "name": "ALU", "desc": "Arithmetic Logic Unit"},
            {"id": "control_unit", "name": "Control Unit", "desc": "Instruction decoding"},
            {"id": "registers", "name": "Registers", "desc": "High-speed storage"},
            {"id": "memory_hierarchy", "name": "Memory Hierarchy", "desc": "Cache vs RAM vs Disk"},
            {"id": "cache", "name": "Cache", "desc": "L1/L2/L3 concepts"},
            {"id": "ram", "name": "RAM", "desc": "Volatile memory"},
            {"id": "rom", "name": "ROM", "desc": "Non-volatile memory"},
            {"id": "instruction_cycle", "name": "Instruction Cycle", "desc": "Fetch, Decode, Execute"},
            {"id": "machine_instructions", "name": "Machine Instructions", "desc": "Opcodes and operands"},
            {"id": "cpu_scheduling", "name": "CPU Scheduling Concepts", "desc": "Hardware thread scheduling"},
            {"id": "pipelining", "name": "Pipelining", "desc": "Instruction throughput"},
            {"id": "risc", "name": "RISC", "desc": "Reduced Instruction Set"},
            {"id": "cisc", "name": "CISC", "desc": "Complex Instruction Set"},
            {"id": "io_arch", "name": "I/O Architecture", "desc": "Buses and controllers"},
            {"id": "interrupts", "name": "Interrupts", "desc": "Hardware signals"},
            {"id": "arch_virtual_mem", "name": "Virtual Memory Concepts", "desc": "Hardware paging support"}
        ]
    },
    {
        "id": "compiler-design",
        "name": "Compiler Design",
        "description": "Parsing, Lexical Analysis, and Code Generation.",
        "icon": "terminal",
        "order": 9,
        "topics": [
            {"id": "compiler_basics", "name": "Compiler Basics", "desc": "Phases of a compiler"},
            {"id": "interpreter_vs", "name": "Interpreter vs Compiler", "desc": "Execution models"},
            {"id": "lexical", "name": "Lexical Analysis", "desc": "Scanning"},
            {"id": "tokens", "name": "Tokens", "desc": "Lexemes"},
            {"id": "compiler_regex", "name": "Regular Expressions", "desc": "Pattern matching"},
            {"id": "syntax", "name": "Syntax Analysis", "desc": "Grammars"},
            {"id": "parsing", "name": "Parsing", "desc": "Top-down, Bottom-up"},
            {"id": "parse_trees", "name": "Parse Trees", "desc": "AST"},
            {"id": "semantic", "name": "Semantic Analysis", "desc": "Type checking"},
            {"id": "intermediate", "name": "Intermediate Code", "desc": "Three-address code"},
            {"id": "optimization", "name": "Optimization", "desc": "Code improvement"},
            {"id": "code_gen", "name": "Code Generation", "desc": "Target machine code"},
            {"id": "symbol_tables", "name": "Symbol Tables", "desc": "Identifier management"},
            {"id": "error_handling", "name": "Error Handling", "desc": "Recovery strategies"}
        ]
    },
    {
        "id": "distributed-systems",
        "name": "Distributed Systems",
        "description": "Scalability, CAP Theorem, and Microservices.",
        "icon": "share-2",
        "order": 10,
        "topics": [
            {"id": "ds_basics", "name": "Distributed Systems Basics", "desc": "Nodes and networks"},
            {"id": "client_server", "name": "Client-Server", "desc": "Request-response models"},
            {"id": "scalability", "name": "Scalability", "desc": "Horizontal vs Vertical"},
            {"id": "availability", "name": "Availability", "desc": "Uptime and SLAs"},
            {"id": "reliability", "name": "Reliability", "desc": "System correctness"},
            {"id": "fault_tolerance", "name": "Fault Tolerance", "desc": "Handling failures"},
            {"id": "replication", "name": "Replication", "desc": "Data redundancy"},
            {"id": "partitioning", "name": "Partitioning", "desc": "Sharding data"},
            {"id": "load_balancing", "name": "Load Balancing", "desc": "Traffic distribution"},
            {"id": "caching", "name": "Caching", "desc": "Distributed caches (Redis/Memcached)"},
            {"id": "cap", "name": "CAP Theorem", "desc": "Consistency, Availability, Partition Tolerance"},
            {"id": "consistency", "name": "Consistency", "desc": "Strong vs Eventual"},
            {"id": "dist_transactions", "name": "Distributed Transactions", "desc": "2PC, Sagas"},
            {"id": "message_queues", "name": "Message Queues", "desc": "Kafka, RabbitMQ concepts"},
            {"id": "microservices", "name": "Microservices Fundamentals", "desc": "Decoupled architecture"}
        ]
    },
    {
        "id": "cyber-security",
        "name": "Cyber Security Fundamentals",
        "description": "Encryption, Authentication, and Vulnerabilities.",
        "icon": "shield",
        "order": 11,
        "topics": [
            {"id": "sec_basics", "name": "Security Basics", "desc": "Threats and mitigations"},
            {"id": "cia", "name": "CIA Triad", "desc": "Confidentiality, Integrity, Availability"},
            {"id": "authn", "name": "Authentication", "desc": "Identity verification"},
            {"id": "authz", "name": "Authorization", "desc": "Access rights"},
            {"id": "encryption", "name": "Encryption", "desc": "Data obfuscation"},
            {"id": "hashing", "name": "Hashing", "desc": "One-way functions"},
            {"id": "symmetric", "name": "Symmetric Encryption", "desc": "Single key cryptography"},
            {"id": "asymmetric", "name": "Asymmetric Encryption", "desc": "Public/Private key pairs"},
            {"id": "digital_sigs", "name": "Digital Signatures", "desc": "Non-repudiation"},
            {"id": "tls", "name": "HTTPS/TLS", "desc": "Secure transport"},
            {"id": "web_vulns", "name": "Common Web Vulnerabilities", "desc": "OWASP Top 10"},
            {"id": "sqli", "name": "SQL Injection Concepts", "desc": "Query manipulation"},
            {"id": "xss", "name": "XSS Concepts", "desc": "Cross-Site Scripting"},
            {"id": "csrf", "name": "CSRF Concepts", "desc": "Cross-Site Request Forgery"},
            {"id": "passwords", "name": "Secure Password Storage", "desc": "Salting and hashing"},
            {"id": "access_control", "name": "Access Control", "desc": "RBAC, ABAC"}
        ]
    }
]

class CSCoreService:
    def __init__(self):
        self._subjects: List[CSSubject] = []
        for s in CS_SUBJECTS_DATA:
            topics = [
                CSTopic(
                    topicId=t["id"],
                    name=t["name"],
                    subjectId=s["id"],
                    description=t["desc"],
                    questionCount=0
                )
                for t in s["topics"]
            ]
            subject = CSSubject(
                subjectId=s["id"],
                name=s["name"],
                description=s["description"],
                icon=s["icon"],
                order=s["order"],
                status="active",
                topics=topics
            )
            self._subjects.append(subject)
            
        self._sessions: Dict[str, List[TechnicalSession]] = {}

    def get_subjects(self) -> List[CSSubject]:
        return self._subjects

    def get_subject(self, subject_id: str) -> Optional[CSSubject]:
        for s in self._subjects:
            if s.subjectId == subject_id:
                return s
        return None

    def get_topic(self, subject_id: str, topic_id: str) -> Optional[CSTopic]:
        subject = self.get_subject(subject_id)
        if not subject:
            return None
        for t in subject.topics:
            if t.topicId == topic_id:
                return t
        return None

    async def generate_cs_question(
        self, 
        subject_name: str,
        topic_name: str, 
        difficulty: TechnicalDifficulty, 
        q_type: TechnicalQuestionType
    ) -> TechnicalQuestion:
        
        prompt = get_cs_core_question_prompt(subject_name, topic_name, difficulty, q_type)
        response_text = await gemini_service.generate_content(prompt)
        
        try:
            clean_text = response_text.replace("```json", "").replace("```", "").strip()
            data = json.loads(clean_text)
            
            # Validation
            if data.get("questionType") in ["mcq", "output", "debugging", "conceptual", "scenario"]:
                if not data.get("options") or len(data["options"]) != 4:
                    raise ValueError("Question must have exactly 4 options.")
                if data.get("correctOption") is None or not (0 <= data["correctOption"] <= 3):
                    raise ValueError("correctOption must be an index between 0 and 3.")
            
            question = TechnicalQuestion(**data)
            question.questionId = f"tech_q_{uuid.uuid4().hex[:8]}"
            return question
            
        except (json.JSONDecodeError, ValueError) as e:
            print(f"CS Core Question generation failed: {str(e)} | Raw: {response_text}")
            raise ValueError("Failed to generate a valid CS Core question. Please try again.")

    async def start_session(
        self, 
        uid: str, 
        subject_id: str,
        topic_id: str, 
        difficulty: TechnicalDifficulty, 
        q_type: TechnicalQuestionType,
        count: int = 5
    ) -> TechnicalSession:
        
        subject = self.get_subject(subject_id)
        topic = self.get_topic(subject_id, topic_id)
        
        if not subject or not topic:
            raise ValueError("Invalid subject or topic ID")

        questions = []
        for i in range(count):
            try:
                q = await self.generate_cs_question(subject.name, topic.name, difficulty, q_type)
                questions.append(q)
            except Exception:
                break
                
        if not questions:
            raise ValueError("Could not generate CS Core questions for this session.")

        session = TechnicalSession(
            sessionId=f"cs_session_{uuid.uuid4().hex[:10]}",
            uid=uid,
            language=TechnicalLanguage.c, # Reusing schema language implicitly since CS Core doesn't bind to an execution language
            topic=topic_id,
            difficulty=difficulty,
            questionCount=len(questions),
            startedAt=datetime.utcnow().isoformat() + "Z",
            questions=questions
        )
        
        if uid not in self._sessions:
            self._sessions[uid] = []
        self._sessions[uid].append(session)
        
        return session

    def get_session(self, uid: str, session_id: str) -> Optional[TechnicalSession]:
        for s in self._sessions.get(uid, []):
            if s.sessionId == session_id:
                return s
        return None

    def complete_session(self, uid: str, session_id: str, final_score: int) -> TechnicalResult:
        session = self.get_session(uid, session_id)
        if not session:
            raise ValueError("Session not found")
            
        session.status = "completed"
        session.completedAt = datetime.utcnow().isoformat() + "Z"
        session.score = final_score
        
        acc = int((final_score / session.questionCount) * 100) if session.questionCount > 0 else 0
        
        return TechnicalResult(
            sessionId=session.sessionId,
            score=final_score,
            totalQuestions=session.questionCount,
            accuracy=acc,
            completedAt=session.completedAt
        )

cs_core_service = CSCoreService()
