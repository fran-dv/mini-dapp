import { Navbar } from "@components/Navbar";
import { WrongChainBanner } from "@components/WrongChainBanner";
import { ToastMessages } from "@components/ToastMessages";

interface Props {
  children: React.ReactNode;
}

export const AppLayout: React.FC<Props> = ({ children }: Props) => {
  return (
    <>
      <WrongChainBanner />
      <Navbar />
      <main>{children}</main>
      <ToastMessages />
    </>
  );
};

export default AppLayout;
