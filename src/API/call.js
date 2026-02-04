// Mock data for paper presentations
// In production, replace with actual API calls

export const fetchNavPapers = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return [
        {
            ppid: "1",
            eventName: "ADVANCEMENTS IN SEMICONDUCTOR PHYSICS",
            image: "/img/gallery-1.webp",
            description: "Explore cutting-edge developments in semiconductor technology"
        },
        {
            ppid: "2",
            eventName: "THE RISE OF DIGITAL TECHNOLOGIES",
            image: "/img/gallery-2.webp",
            description: "Understanding the digital transformation era"
        },
        {
            ppid: "3",
            eventName: "TECHNO-SUSTAINABILITY",
            image: "/img/gallery-3.webp",
            description: "Technology for a sustainable future"
        },
        {
            ppid: "4",
            eventName: "SPACE SYSTEMS & WIRELESS TRANSPORT",
            image: "/img/gallery-4.webp",
            description: "Innovations in space technology and communications"
        },
        {
            ppid: "5",
            eventName: "GREEN INNOVATION & TECHNO CREDITS",
            image: "/img/gallery-5.webp",
            description: "Environmental technology and carbon credits"
        },
        {
            ppid: "6",
            eventName: "அறிவியல் ஆய்வுகள்",
            image: "/img/about.webp",
            description: "Science research in Tamil language"
        }
    ];
};

export const fetchPapers = async () => {
    return fetchNavPapers();
};
