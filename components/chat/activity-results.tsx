import Link from "next/link";
import Image from "next/image";
import { WellnessActivities } from "@/lib/wellnessChatbot";
import { GivebackActivities } from "@/lib/givebackChatbot";

export default function ActivitiesResult({
  activities
}: {
  activities: WellnessActivities | GivebackActivities;
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
              <div className="flex-shrink-0 p-4 h-full rounded-lg bg-background border border-border w-64">
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
      <div className="text-center mt-2 flex justify-center items-center">
        {`Didn't find what you're looking for? Need help? `}
        <Link
          href="https://meetings.hubspot.com/caitlin-iseler?uuid=518b07de-3f5a-469c-b7cf-6bf22643553c"
          target="_blank"
          rel="noopener noreferrer"
          className="underline ml-1"
        >
          Click here to connect with our team!
        </Link>
      </div>
    </div>
  );
}
