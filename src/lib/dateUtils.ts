export function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'przed chwilą';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      if (diffInMinutes === 1) return '1 minutę temu';
      if (diffInMinutes > 1 && diffInMinutes < 5) return `${diffInMinutes} minuty temu`;
      return `${diffInMinutes} minut temu`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      if (diffInHours === 1) return '1 godzinę temu';
      if (diffInHours > 1 && diffInHours < 5) return `${diffInHours} godziny temu`;
      if (diffInHours >= 5 && diffInHours < 22) return `${diffInHours} godzin temu`;
      if (diffInHours >= 22) return `${diffInHours} godziny temu`;
      return `${diffInHours} godzin temu`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      if (diffInDays === 1) return 'wczoraj';
      if (diffInDays > 1 && diffInDays < 5) return `${diffInDays} dni temu`;
      return `${diffInDays} dni temu`;
    }

    // Default to existing format for older dates
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch (e) {
    return dateString;
  }
}

export function formatDate(dateString: string) {
  return formatTimeAgo(dateString);
}
