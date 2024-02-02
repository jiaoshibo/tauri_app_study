import { reactive } from 'vue';

export function useDialogConfig(){
    return reactive({
        visible:false,
        closeOnClickModal:false,
        closeOnPressEscpe:false,
        draggable:true,
        dialogTitle:''
    })
}