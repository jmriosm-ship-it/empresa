import { createClient } from "@supabase/supabase-js";

// Esta key "sb_publishable_..." es pública por diseño (la misma que ya estaba en el HTML).
// La seguridad real la dan las políticas RLS de Supabase, no esconder esta key.
const SUPABASE_URL = "https://zqjsvrrsbtovdilflkbp.supabase.co";
const SUPABASE_KEY = "sb_publishable_2GuIxS-f8B4czOyCxc-KdQ_J-X7AxYY";

export const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
