import fs from "fs";
import path from "path";
import yaml from "yaml";

export interface NavItem {
  title: string;
  url: string;
  icon: string;
  items?: Omit<NavItem, "icon">[];
}

export interface AppConfig {
  title: string;
  logo: string;
  nav: NavItem[];
}

export function getConfig(): AppConfig {
  try {
    const filePath = path.join(process.cwd(), "config.yaml");
    const fileContents = fs.readFileSync(filePath, "utf8");
    return yaml.parse(fileContents) as AppConfig;
  } catch (error) {
    console.error("Failed to parse config.yaml:", error);
    return {
      title: "Admin",
      logo: "AdminLogo",
      nav: [],
    };
  }
}
