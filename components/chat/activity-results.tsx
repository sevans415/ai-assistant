import Link from "next/link";
import Image from "next/image";
import { ActivitiesResults } from "@/lib/chatbot";

export default function ActivitiesResult({
  activities
}: {
  activities: ActivitiesResults;
}) {
  return (
    <div className="">
      {activities && (
        <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
          {activities.slice(0, 3).map((activity, index) => (
            <Link
              key={index}
              href="https://www.happyly.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex-shrink-0 p-4 h-full rounded-lg bg-zinc-800/50 border border-zinc-700 w-64">
                <h3 className="font-medium mb-2 text-center">
                  {activity.metadata?.headline}
                </h3>
                <Image
                  src={`/museum_${index + 1}.jpg`}
                  alt="Virginia Science Museum"
                  width={256}
                  height={160}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
              </div>
            </Link>
          ))}
        </div>
      )}
      <Link
        href={`https://www.happyly.com`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-zinc-300 underline block text-center mt-2 flex justify-center items-center"
      >
        {`Didn't find what you're looking for? Need help? Click here to connect
        with our team!`}
      </Link>
    </div>
  );
}
