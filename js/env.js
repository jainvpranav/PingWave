import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseurl='https://crbnocpxvakggoxsevmv.supabase.co'
const supabasekey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyYm5vY3B4dmFrZ2dveHNldm12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAyODY3MDMsImV4cCI6MjAwNTg2MjcwM30.1CZMxlMeh2UfkO2Zz6rZam-ewCgSlr8QJmgJfPsjsy0'

export const supabase = createClient(supabaseurl, supabasekey);