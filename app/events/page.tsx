import Navbar from "@/components/Navbar";
import EventsSection from "@/components/EventsSection";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Events · IEEE Region 10 IEEEXtreme",
  description:
    "Explore upcoming IEEEXtreme workshops, hackathons, and technical sessions across IEEE Region 10.",
};

export default function EventsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <EventsSection />
      </main>
      <Footer />
    </>
  );
}
