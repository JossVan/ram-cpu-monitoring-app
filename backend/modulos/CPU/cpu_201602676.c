#include <linux/module.h>
#include <linux/init.h>
#include <linux/kernel.h>
#include <linux/fs.h>
#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <asm/uaccess.h>
#include <linux/hugetlb.h>
// PARA EL CPU
#include <linux/sched.h>
#include <linux/sched/signal.h>
#include <linux/mm.h>

MODULE_DESCRIPTION("módulo que lee la CPU del sistema");
MODULE_LICENSE("GPL");
MODULE_AUTHOR("Josselyn Polanco");

struct task_struct *proceso,*procesoHijo;
struct list_head *hijos;
struct sysinfo info;
static int Escribir_Archivo(struct seq_file *archivo, void *v)
{
    long num_process=0;
    long num_process2=0;
    unsigned long rss;
    si_meminfo(&info);
    // recorre la lista de procesos
    seq_printf(archivo,"{");
    for_each_process(proceso){
        //obtengo el porcentaje
        num_process = num_process+1;
    }
    for_each_process(proceso){
        seq_printf(archivo,"{");
        //PID del proceso
        seq_printf(archivo,"\"pid\":%d,",proceso->pid);
        //nombre del proceso
        seq_printf(archivo,"\"nombre\":%s,",proceso->comm);
        //estado
        seq_printf(archivo,"\"estado\":%ld",proceso->state);

        // CONDICIÓN PARA PODER OBTENER EL PORCENTAJE DE RAM UTILIZADO
        if (proceso->mm){
            rss = get_mm_rss(proceso->mm) << PAGE_SHIFT;
            //ram
            seq_printf(archivo,",\"ram\":%ld,",rss);
            
        } 
        // obtengo los hijos de cada proceso (si tiene)
        seq_printf(archivo,"\"hijos\":[");
        long cantHijos = 0;
        long cantHijos2 = 0;
        list_for_each(hijos, &(proceso->children)){
            cantHijos = cantHijos+1;
        }
        list_for_each(hijos, &(proceso->children)){
            //empieza la sección del hijo
            procesoHijo = list_entry(hijos, struct task_struct,sibling);
            seq_printf(archivo,"{\"nombre\":%s,",procesoHijo->comm);
            seq_printf(archivo,"\"pid\":%d}",procesoHijo->pid);
            cantHijos2 = cantHijos2 +1;
            if (cantHijos != cantHijos2){
                seq_printf(archivo,",");
            }
        }
        seq_printf(archivo,"]");
        seq_printf(archivo,"}");
        num_process2 = num_process2+1;
        if(num_process2 != num_process){
            seq_printf(archivo,",");
        }
    }
    seq_printf(archivo,"\"total_procesos\":%ld",num_process);
    seq_printf(archivo,"}");
	return 0;
}

static int abrir(struct inode *inode, struct file *file)
{
	return single_open(file, Escribir_Archivo, NULL);
}

static const struct proc_ops operaciones = {
	.proc_open = abrir,
	.proc_read = seq_read,
	.proc_lseek = seq_lseek,
	.proc_release = single_release,
};

static int __init insert(void)
{
	printk(KERN_INFO "Cargando modulo.\r\n");
	proc_create("cpu_201602676", 0, NULL, &operaciones);
	printk(KERN_INFO "***** Proyecto 1 *****\n");
    printk(KERN_INFO "Nombre: Josselyn Vanessa Polanco Gameros");
    printk(KERN_INFO "Insertando el módulo para información de CPU\n");
    
	return 0;
}

static void __exit remove(void)
{
	remove_proc_entry("cpu_201602676", NULL);
	printk(KERN_INFO "***** Proyecto 1 *****\n");
    printk(KERN_INFO "Curso: SISTEMAS OPERATIVOS I");
    printk(KERN_INFO "Diciembre 2021");
    printk(KERN_INFO "Removiendo el módulo para información de CPU\n");
}

module_init(insert);
module_exit(remove);

