export function handleStorageError(error: any, setError: (message: string) => void) {
  if (error instanceof Error) {
    setError(error.message);
  } else {
    setError('Ha ocurrido un error inesperado');
  }
}