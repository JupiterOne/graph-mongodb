type MongoDBLink = {
  href: string;
  rel: string;
};

export type Organization = {
  id: string;
  isDeleted: boolean;
  name: string;
  links: MongoDBLink[];
};

export type Team = {
  id: string;
  name: string;
  links: MongoDBLink[];
};

export type Project = {
  id: string;
  name: string;
  orgId: string;
  clusterCount: number;
  created: string;
  links: MongoDBLink[];
};
