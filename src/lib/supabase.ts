// Supabase 客戶端設定
import { createClient } from '@supabase/supabase-js'
import { Article, ArticleLike } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 資料庫表格類型定義
export type Database = {
  public: {
    Tables: {
      rss_entries: {
        Row: Article
        Insert: Omit<Article, 'id' | 'created_at' | 'likes_count'>
        Update: Partial<Omit<Article, 'id' | 'created_at'>>
      }
      article_likes: {
        Row: ArticleLike
        Insert: Omit<ArticleLike, 'id' | 'created_at'>
        Update: Partial<Omit<ArticleLike, 'id' | 'created_at'>>
      }
    }
    Functions: {
      get_similar_articles: {
        Args: {
          target_article_id: number
          similarity_threshold?: number
          limit_count?: number
        }
        Returns: (Article & { similarity: number })[]
      }
      increment_likes: {
        Args: { article_id: number }
        Returns: void
      }
      decrement_likes: {
        Args: { article_id: number }
        Returns: void
      }
    }
  }
}

// 類型化的 Supabase 客戶端
export type TypedSupabaseClient = typeof supabase

// 輔助函數：檢查 Supabase 連線
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('rss_entries')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error('Supabase connection error:', error)
      return false
    }
    
    return true
  } catch (err) {
    console.error('Connection check failed:', err)
    return false
  }
}