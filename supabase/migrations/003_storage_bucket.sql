-- Crear bucket para fotos de esmorzars
INSERT INTO storage.buckets (id, name, public)
VALUES ('esmorzar-photos', 'esmorzar-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Política para subir fotos (solo usuarios autenticados pueden subir)
CREATE POLICY "Users can upload own photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'esmorzar-photos' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Política para ver fotos (públicas)
CREATE POLICY "Anyone can view photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'esmorzar-photos');

-- Política para eliminar fotos (solo el propietario)
CREATE POLICY "Users can delete own photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'esmorzar-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

