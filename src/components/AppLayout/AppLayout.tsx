import { Navbar } from "@components/Navbar";
import { WrongChainBanner } from "@components/WrongChainBanner";

interface Props {
  children: React.ReactNode;
}

export const AppLayout: React.FC<Props> = ({ children }: Props) => {
  return (
    <>
      <WrongChainBanner />
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default AppLayout;
