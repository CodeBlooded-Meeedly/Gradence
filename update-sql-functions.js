import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = 'https://rqpdfplevdrgvsiwxhcv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcGRmcGxldmRyZ3ZzaXd4aGN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNTIxMzEsImV4cCI6MjA2NTkyODEzMX0.oo5zqTfleo4qwMmRsFrG2zBPj2G8rIq1U0QTSp6_Odg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function updateSQLFunctions() {
  try {
    // Read the SQL file
    const sqlContent = fs.readFileSync('leaderboard-functions.sql', 'utf8')
    
    // Split into individual statements
    const statements = sqlContent.split(';').filter(stmt => stmt.trim())
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.substring(0, 100) + '...')
        const { error } = await supabase.rpc('exec_sql', { sql: statement })
        if (error) {
          console.error('Error executing statement:', error)
        } else {
          console.log('Successfully executed statement')
        }
      }
    }
    
    console.log('All SQL functions updated successfully!')
  } catch (error) {
    console.error('Error updating SQL functions:', error)
  }
}

updateSQLFunctions() 