export const exportData = (data) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `budget-data-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importData = (file, onSuccess, onError) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result);
      if (importedData.expenses && Array.isArray(importedData.expenses)) {
        onSuccess(importedData);
      } else {
        onError('올바르지 않은 파일 형식입니다.');
      }
    } catch (error) {
      onError('파일을 읽는 중 오류가 발생했습니다.');
    }
  };
  reader.readAsText(file);
};