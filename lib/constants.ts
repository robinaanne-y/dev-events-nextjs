export type EventItem = {
    id: number;
    title: string;
    slug: string;
    time:string;
    date: string;
    location: string;
    image: string;
};

export const events: EventItem[] = [
    {
        id: 1,
        title: "React Summit 2024",
        date: "2024-11-15",
        time: "10:00 AM",
        slug: "react-summit-2024",
        location: "Amsterdam, Netherlands",
        image: "/images/event1.png",
    },
    {
        id: 2,
        title: "Next.js Conf",
        date: "2024-10-24",
        time: "10:00 AM",
        slug: "next.js-conf",
        location: "San Francisco, CA",
        image: "/images/event2.png",
    },
    {
        id: 3,
        title: "AI Hack Day Manila",
        date: "2024-12-07",
        time: "10:00 AM",
        slug: "ai-hack-day-manila",
        location: "Makati City, Philippines",
        image: "/images/event3.png",
    },
    {
        id: 4,
        title: "Google I/O Extended",
        date: "2024-06-20",
        time: "10:00 AM",
        slug: "google-io-extended",
        location: "Manila, Philippines",
        image: "/images/event4.png",
    },
    {
        id: 5,
        title: "DockerCon",
        date: "2024-10-08",
        time: "10:00 AM",
        slug: "dockercon",
        location: "Los Angeles, CA",
        image: "/images/event5.png",
    },
    {
        id: 6,
        title: "GitHub Universe",
        date: "2024-11-01",
        time: "10:00 AM",
        slug: "github-universe",
        location: "San Francisco, CA",
        image: "/images/event6.png",
    }
];

export default events;