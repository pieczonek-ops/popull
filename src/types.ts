export interface ArticleSubSection {
  id: string;
  title: string;
  imageUrl: string;
  imageSource?: string;
  content: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content?: string;
  category: string;
  imageUrl: string;
  timestamp: string;
  readTime: string;
  isBreaking?: boolean;
  imageSource?: string;
  subSections?: ArticleSubSection[];
  displayMode?: 'single' | 'multi';
}

export interface HomeSection {
  id: string;
  title: string;
  category: string;
  count: number;
  layout: 'grid' | 'horizontal' | 'small' | 'video';
  backgroundColor?: string;
  backgroundImageUrl?: string;
  titleColor?: string;
  linkColor?: string;
  showSeeMore?: boolean;
  seeMoreText?: string;
  seeMoreColor?: string;
  showDescription?: boolean;
  showDate?: boolean;
  showCategory?: boolean;
  showReadTime?: boolean;
  showCommentsCount?: boolean;
}

export interface CommentsConfig {
  showCount: boolean;
  showDate: boolean;
  showAvatars: boolean;
  allowReplies: boolean;
}

export interface HomeConfig {
  hero: {
    articleId?: string;
    backgroundColor?: string;
    textColor?: string;
    buttonType: 'solid' | 'outline' | 'gradient';
    buttonColor?: string;
    buttonIcon?: string;
    showCard: boolean;
    showCommentsCount?: boolean;
  };
  sections: HomeSection[];
  comments?: CommentsConfig;
}

export interface ViralNews {
  id: string;
  title: string;
  category: string;
  rank: string;
}

export interface Comment {
  id: string;
  articleId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  content: string;
  timestamp: any;
  parentId?: string;
  replyToName?: string;
}
