import type { Project } from "@/api";
import { createContext, useContext } from "react";

type ProjectContextType = {
  project: Project | null;
};

export const ProjectContext = createContext<ProjectContextType>({
  project: null,
});

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  return context;
};
