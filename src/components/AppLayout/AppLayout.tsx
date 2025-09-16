interface Props {
  children: React.ReactNode;
}

export const AppLayout: React.FC<Props> = ({ children }: Props) => {
  return <div>{children}</div>;
};

export default AppLayout;
