export function getParentIdList(list, id) {
  if (!list || !id) {
    return ''
  }
  let arr = [];
  let findParent = (data, nodeId, parentId) => {
    for (var i = 0, length = data.length; i < length; i++) {
      let node = data[i];
      if (node.id === nodeId) {
        arr.unshift(nodeId);
        if (nodeId === list[0].id) {
          break
        }
        findParent(list, parentId);
        break
      } else {
        if (node.children) {
          findParent(node.children, nodeId, node.id);
        }
        continue
      }
    }
    return arr;
  }
  return findParent(list, id);
}


