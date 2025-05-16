import { InputChat } from '@/components/InputChat';
import { MdSupportAgent } from 'react-icons/md';
import { RiRobot2Line } from 'react-icons/ri';

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-between">
      <div className="flex items-center gap-4 p-4">
        <MdSupportAgent size={32} />
        <h1 className="text-3xl font-black ">Agent UI</h1>
        <RiRobot2Line size={32} />
      </div>
      <div className="w-full flex justify-center">
        <InputChat />
      </div>
    </main>
  );
}
