#include <linux/module.h>
#include <linux/init.h>
#include <linux/kernel.h>
#include <linux/fs.h>
#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <asm/uaccess.h>
#include <linux/hugetlb.h>

MODULE_DESCRIPTION("módulo que lee la RAM del sistema");
MODULE_LICENSE("GPL");
MODULE_AUTHOR("Josselyn Polanco");
struct sysinfo info;
unsigned long cached;
unsigned long memorytotal;
double a;
unsigned long pages[NR_LRU_LISTS];
int lru;

static int Escribir_Archivo(struct seq_file *archivo, void *v)
{
    #define K(x) ((x) << (PAGE_SHIFT - 10))
        si_meminfo(&info);
        cached = global_node_page_state(NR_FILE_PAGES) -
                global_node_page_state(QC_SPACE) - info.bufferram;
        if (cached < 0)
            cached = 0;
        for (lru = LRU_BASE; lru < NR_LRU_LISTS; lru++)
            pages[lru] = global_node_page_state(NR_LRU_BASE + lru);

        seq_printf(archivo, "%8lu\n", K(info.totalram)); // memoria total
        seq_printf(archivo, "%8ld\n", ((K(info.totalram) - (K(info.freeram) + K(info.bufferram) + K(cached))))); // memoria en uso
        seq_printf(archivo, "%8ld\n", (K(info.freeram))); // memoria libre
        seq_printf(archivo, "%8ld\n", (K(cached))); //caché
        seq_printf(archivo, "%8ld\n", (K(info.bufferram))); // buffer
        seq_printf(archivo, "%8ld", (((K(info.totalram) - (K(info.freeram) + K(info.bufferram) + K(cached))) * 100) / (K(info.totalram)))); //porcentaje de memoria en uso

    #undef K
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
	proc_create("memo_201602676", 0, NULL, &operaciones);
	printk(KERN_INFO "***** Proyecto 1 *****\n");
    printk(KERN_INFO "Nombre: Josselyn Vanessa Polanco Gameros");
    printk(KERN_INFO "Carnet: 201602676");
    printk(KERN_INFO "Insertando el módulo para información de RAM\n");
    
	return 0;
}

static void __exit remove(void)
{
	remove_proc_entry("memo_201602676", NULL);
	printk(KERN_INFO "***** Proyecto 1 *****\n");
    printk(KERN_INFO "Curso: SISTEMAS OPERATIVOS I");
    printk(KERN_INFO "Nombre: Josselyn Vanessa Polanco Gameros");
    printk(KERN_INFO "Carnet: 201602676");
    printk(KERN_INFO "Removiendo el módulo para información de RAM\n");
}

module_init(insert);
module_exit(remove);

