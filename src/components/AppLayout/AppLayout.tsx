import { Navbar } from "@components/Navbar";

interface Props {
  children: React.ReactNode;
}

export const AppLayout: React.FC<Props> = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default AppLayout;
