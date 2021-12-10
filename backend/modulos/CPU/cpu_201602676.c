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
MODULE_DESCRIPTION("módulo que lee la CPU del sistema");
MODULE_LICENSE("GPL");
MODULE_AUTHOR("Josselyn Polanco");

struct task_struct *proceso,*procesoHijo;
struct list_head *hijos;

static int Escribir_Archivo(struct seq_file *archivo, void *v)
{
    for_each_process(proceso){
        seq_printf(archivo,"Proceso %s (PID: %d)\n",proceso->comm, proceso->pid);
        list_for_each(hijos, &(proceso->children)){
            procesoHijo = list_entry(hijos, struct task_struct,sibling);
            seq_printf(archivo,"\tProceso Hijo %s (PID: %d)\n", procesoHijo->comm,proceso->pid);
        }
    }
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

